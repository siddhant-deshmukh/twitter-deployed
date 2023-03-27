// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../lib/dbConnect'
import mongoose from 'mongoose'
import Tweet, { ITweet } from '../../models/Tweet'
import User from '../../models/User'

type Data = ITweet[]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const {
    body,
    method
  } = req
  await dbConnect()

  const { skip, limit } = req.query
  // console.log(skip,limit)
  // console.log(`${(skip)?Number(skip):0}`,`${(limit)?Number(skip):5}`)
  const tweets = await Tweet.aggregate([
    { $skip: (skip)?Number(skip):0 },
    { $limit:(limit)?Number(limit):5 },
    { $lookup:
      {
        from: "users",
        localField: "author",
        foreignField: "_id",
        pipeline:[
          {$project : {avatar : 1, user_name: 1, name : 1, about: 1}}
        ],

        as: "authorDetails"
      }
    },
    { $set : {
      authorDetails : { $arrayElemAt : ["$authorDetails",0] },
      num_likes: { $size : '$liked_by' },
      num_comments: { $size : '$comment_tweets' },
      num_quotes: { $size : '$quotes_tweets' },
      num_retweet: { $size : '$retweet_by' },
    }}
  ])
  console.log('was here',skip,limit)
  if(limit === '1'){
    return res.status(200).json(tweets || {})
  }
  res.status(200).json(tweets)
}
