// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/dbConnect'
import mongoose from 'mongoose'
import Tweet, { ITweet, ITweetStored } from '../../../models/Tweet'
import User from '../../../models/User'
import { getUserSession } from '@/lib/getUserFromToken'

type Data = ITweet[] | { msg: string }

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
            { $sort : { time : -1 } },
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

        const { text, parent_tweet, attachments } = body
        if (
            !author_id || !text ||
            typeof text !== 'string' ||
            text.length > 400 || text.length <= 0
        ) {
            console.log(!author_id, !text, author_id, text, typeof author_id !== 'string', typeof text !== 'string')
            return res.status(400).json({ msg: 'incorrect data given' })
        }

        const author = await User.findById(author_id)
        if (!author) return res.status(400).json({ msg: 'incorrect given author_id' })

        let parent_check: any;
        if (parent_tweet) {
            parent_check = await Tweet.findById(parent_tweet)
            if (!parent_check) return res.status(404).json({ msg: 'incorrect given parent_tweet' })
        }

        const tweet = await Tweet.create({
            author: author_id,
            parent_tweet,
            text,
            attachments
        })

        if (tweet) {
            author.num_tweets = author.num_tweets || 0 + 1
            author.save()
        }
        if (parent_check) {
            parent_check.num_comments = author.num_comments || 0 + 1
            parent_check.save()
        }
        return res.status(200).json(tweet)
    } else {
        return res.status(404).json({ msg: "method doesn't exist" })
    }
}
