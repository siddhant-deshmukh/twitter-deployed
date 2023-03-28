// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/dbConnect'
import mongoose from 'mongoose'
import Tweet, { ITweet } from '../../../models/Tweet'
import User from '../../../models/User'

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
                let: { tweet_author: { $toObjectId : "64219d64a6a5b870d5753c03" }, tweet_id: { $toObjectId : "$_id" } },
                pipeline: [
                    {   
                        $match: {
                            $expr: {
                                 $and : [
                                    {$eq: [ "$tweetId", "$$tweet_id" ]},
                                    {$eq: [ "$userId", "$$tweet_author" ]},
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
                let: { tweet_author: { $toObjectId : "64219d64a6a5b870d5753c03" }, tweet_id: { $toObjectId : "$_id" } },
                pipeline: [
                    {   
                        $match: {
                            $expr: {
                                 $and : [
                                    {$eq: [ "$tweetId", "$$tweet_id" ]},
                                    {$eq: [ "$userId", "$$tweet_author" ]},
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
                have_liked: {  $cond: [ { $gte: [ {$size : '$have_liked'}, 1 ] }, true, false ]  },
                have_retweeted: {  $cond: [ { $gte: [ {$size : '$have_retweeted'}, 1 ] }, true, false ]  },
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
    res.status(200).json(tweets)
}
