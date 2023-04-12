// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/dbConnect'
import mongoose from 'mongoose'
import Tweet, { ITweet, ITweetStored } from '../../../models/Tweet'
import User from '../../../models/User'
import { getUserSession } from '@/lib/getUserFromToken'
import Media, { IMedia } from '@/models/Media'
import { BlobSASPermissions, BlobServiceClient, generateBlobSASQueryParameters, StorageSharedKeyCredential } from '@azure/storage-blob'

type Data = { tweet: ITweet, media_ids?: mongoose.Types.ObjectId[] } | { msg: string } | ITweet[]

// const connectionString = process.env.BLOB_CONNECTION_STRING as string;
// const accountName = process.env.BLOB_ACCOUNT_NAME as string;
// const accountKey = process.env.BLOB_ACCOUNT_KEY as string;

// const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
// const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

const permissions_towrite = new BlobSASPermissions();
permissions_towrite.create = true;
permissions_towrite.write = true;

const maxSize = 0.5 * 1024 * 1024;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    const {
        body,
        method
    } = req

    await dbConnect()
    const user = await getUserSession(req, res)
    if (!user) {
        return res.status(401).json({ msg: 'error in token!!' })
    }

    if (method === 'GET') {
        const { skip, limit } = req.query
        // console.log(skip,limit)
        // console.log(`${(skip)?Number(skip):0}`,`${(limit)?Number(skip):5}`)
        const tweets = await Tweet.aggregate([
            {
                $match: {
                    parent_tweet : { $exists : false  }
                }
            },
            { $sort: { time: -1 } },
            { $skip: (skip) ? Number(skip) : 0 },
            { $limit: (limit) ? Number(limit) : 5 },
            {
                $lookup:
                {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    pipeline: [
                        { $project: { avatar: 1, user_name: 1, name: 1, about: 1 } }
                    ],

                    as: "authorDetails"
                }
            },
            {
                $lookup:
                {
                    from: "likes",
                    let: { tweet_author: { $toObjectId: user._id }, tweet_id: { $toObjectId: "$_id" } },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$tweetId", "$$tweet_id"] },
                                        { $eq: ["$userId", "$$tweet_author"] },
                                    ]
                                }
                            },
                        },
                    ],

                    as: "have_liked"
                }
            },
            {
                $lookup:
                {
                    from: "retweets",
                    let: { tweet_author: { $toObjectId: user._id }, tweet_id: { $toObjectId: "$_id" } },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$tweetId", "$$tweet_id"] },
                                        { $eq: ["$userId", "$$tweet_author"] },
                                    ]
                                }
                            }

                        },
                    ],

                    as: "have_retweeted"
                }
            },
            {
                $lookup: {
                    from: 'media',
                    localField: 'media',
                    foreignField: '_id',
                    as: 'media'
                }
            },
            {
                $set: {
                    authorDetails: { $arrayElemAt: ["$authorDetails", 0] },
                    have_liked: { $cond: [{ $gte: [{ $size: '$have_liked' }, 1] }, true, false] },
                    have_retweeted: { $cond: [{ $gte: [{ $size: '$have_retweeted' }, 1] }, true, false] },
                    // have_liked : { $arrayElemAt: ["$have_liked", 0] },
                    // have_retweeted : { $arrayElemAt: ["$have_retweeted", 0] },
                }
            },
            // {
            //     $project : {
            //         have_retweeted : 1 , have_liked : 1
            //     }
            // }
        ])

        console.log('was here', skip, limit)
        if (limit === '1') {
            return res.status(200).json(tweets || {})
        }
        return res.status(200).json(tweets)
    } else if (method === 'POST') {
        const author_id = user._id

        const { text, parent_tweet, tweet_attachment, mediaFiles }: {
            text: string, parent_tweet?: string, tweet_attachment?: string, mediaFiles?: IMedia[]
        } = body
        if (
            !author_id || !text ||
            typeof text !== 'string' ||
            text.length > 400 || text.length <= 0
        ) {
            console.log(!author_id, !text, author_id, text, typeof author_id !== 'string', typeof text !== 'string')
            return res.status(400).json({ msg: 'incorrect data given' })
        }

        try {
            const author = await User.findById(author_id)
            if (!author) return res.status(400).json({ msg: 'incorrect given author_id' })

            let parent_check: any;
            if (parent_tweet) {
                parent_check = await Tweet.findById(parent_tweet)
                if (!parent_check) return res.status(404).json({ msg: 'incorrect given parent_tweet' })
            }

            let tweet = await Tweet.create({
                author: author_id,
                parent_tweet,
                text
            })

            let media_ids: mongoose.Types.ObjectId[] = []
            if (mediaFiles) {
                media_ids = await CreateMediaFilesAndTokens(mediaFiles, tweet)
                tweet.media = media_ids
                tweet = await tweet.save()
            }

            if (tweet) {
                author.num_tweets = author.num_tweets || 0 + 1
                author.save()
            }
            if (parent_check) {
                parent_check.num_comments = author.num_comments || 0 + 1
                parent_check.save()
            }
            return res.status(200).json({ tweet, media_ids })
        } catch (err) {
            console.log("Some error occured!", err)
        }
    } else {
        return res.status(404).json({ msg: "method doesn't exist" })
    }
}

async function CreateMediaFilesAndTokens(mediaFiles: IMedia[], tweet: ITweetStored) {
    const createMedia = mediaFiles.map(async (media, index) => {
        if ((media.type === 'image/gif' || media.type === 'image/jpeg' ||
            media.type === 'image/jpg' || media.type === 'image/png' ||
            media.type === 'image/webp') && media.size < 2097152) {
            const mediaDoc = await Media.create({
                type: media.type,
                size: media.size,
                url: `${process.env.BLOB_STORAGE_ACCOUNT_URL}/${tweet.author.toString()}/${tweet._id.toString()}_${index}`,
                author: tweet.author.toString(),
                parent_tweet: tweet._id.toString(),
            })
            if (mediaDoc && mediaDoc._id) {
                // return mediaDoc._id as mongoose.Types.ObjectId
                return mediaDoc._id as mongoose.Types.ObjectId
            } else {
                return null
            }
        } else {
            return null;
        }
    })
    const mediaIds = await Promise.all(createMedia)
    let mediaIds_ = mediaIds.filter((ele) => ele !== null) as mongoose.Types.ObjectId[]
    return mediaIds_
}


/* 
s
You can give object-level permissions using SAS token in Azure Blob Storage using JavaScript by creating a SAS token with appropriate permissions and then using it to authenticate your request to upload an image to that blob². Here are the general steps:
1. Create a Shared Access Signature (SAS) token for your storage account or container using one of the methods mentioned in my previous response.
2. Use the SAS token to authenticate your request to upload a blob and set the desired name for your blob using the `x-ms-blob-name` header².

Here's an example of how to create a SAS token with object-level permissions using JavaScript:
```javascript
const { BlobServiceClient } = require("@azure/storage-blob");

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

const blobName = "myBlobName";
const blobClient = containerClient.getBlobClient(blobName);

const sasToken = generateSasToken(blobClient.url, "racwdlup");

async function uploadBlob() {
  const response = await fetch(fileUrl);
  const blobOptions = { blobHTTPHeaders: { blobContentType: "image/jpeg" } };
  const blockBlobClient = blobClient.getBlockBlobClient();
  await blockBlobClient.uploadStream(response.body, undefined, undefined, blobOptions);
}

function generateSasToken(uri, permissions) {
  const sasGenerator = new BlobSASPermissions();
  sasGenerator.parse(permissions);

  const sasQueryParams = {
    permissions: sasGenerator.toString(),
    startsOn: new Date(),
    expiresOn: new Date(new Date().valueOf() + 86400),
    containerName,
    blobName,
  };

  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
  const sasToken = generateBlobSASQueryParameters(sasQueryParams, sharedKeyCredential).toString();

  return `${uri}?${sasToken}`;
}
```
In this example, we're using the `@azure/storage-blob` package to create a BlobServiceClient and ContainerClient objects which we use to get a BlobClient object for our desired blob⁴. We then generate a SAS token with object-level permissions using the `generateSasToken()` function which takes in the URL of our BlobClient object and a string of permissions as arguments⁴. Finally, we use this SAS token to authenticate our request to upload an image to that blob and set the desired name for our blob using the `x-ms-blob-name` header².

I hope this helps! Let me know if you have any other questions.

Source: Conversation with Bing, 06/04/2023(1) Grant limited access to Azure Storage resources using shared access .... https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview Accessed 06/04/2023.
(2) Tutorial: Access Azure Storage using a SAS credential - Linux .... https://learn.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/tutorial-linux-vm-access-storage-sas Accessed 06/04/2023.
(3) How to Generate an Azure SAS Token to Access Storage Accounts. https://adamtheautomator.com/azure-sas-token/ Accessed 06/04/2023.
(4) Azure Storage Blobs User Delegation SAS Tokens now Generally Available. https://azure.microsoft.com/en-us/updates/azure-storage-blobs-user-delegation-sas-tokens-now-generally-available/ Accessed 06/04/2023.
*/