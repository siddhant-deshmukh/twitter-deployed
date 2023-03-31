// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../../lib/dbConnect'
import mongoose from 'mongoose'
import Tweet, { ITweet } from '../../../../models/Tweet'
import User from '../../../../models/User'
import { getUserSession } from '@/lib/getUserFromToken'

type Data = ITweet | { msg: string }

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
  const {  tweet_id } = req.query
  // console.log(skip,limit)
  // console.log(`${(skip)?Number(skip):0}`,`${(limit)?Number(skip):5}`)

  if (!tweet_id || tweet_id.length !== 24) {
    return res.status(400).json({ msg: 'No tweet_id found' })
  }
  const tweetid = new mongoose.Types.ObjectId(tweet_id as string)
  // console.log(tweet_id)
  const tweets = await Tweet.aggregate([
    { $match: { _id: tweetid } },
    // {
    //   $lookup:
    //   {
    //     from: "users",
    //     localField: "author",
    //     foreignField: "_id",
    //     pipeline: [
    //       { $project: { avatar: 1, user_name: 1, name: 1, about: 1 } }
    //     ],

    //     as: "authorDetails"
    //   }
    // },
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
  ])
  // console.log('here to look tweet',tweet_id)
  if(tweets.length > 0){
    res.status(200).json(tweets[0])
  }else{
    res.status(404).json({msg : 'Tweet not found'})
  }
}
