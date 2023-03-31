// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../../lib/dbConnect'
import mongoose from 'mongoose'
import Tweet, { ITweet } from '../../../../models/Tweet'
import User, { IUser } from '../../../../models/User'
import { getUserSession } from '@/lib/getUserFromToken'
import Liked from '@/models/Liked'

type Data = IUser | { msg: string }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const {
        body,
        method
    } = req
    await dbConnect()

    console.log(req.cookies)

    const { user_id, skip, limit, type }: {
        user_id?: string, skip?: string, limit?: string, type?: 'liked' | 'tweets'
    } = req.query

    if (!user_id || user_id.length !== 24) {
        return res.status(400).json({ msg: 'No user_id found' })
    }
    const userid = new mongoose.Types.ObjectId(user_id as string)

    const user = await getUserSession(req, res)
    if (!user) {
        return res.status(401).json({ msg: 'error in token!!' })
    }

    var tweets: any[] = [];
    if (type === 'liked') {
        tweets = await Liked.aggregate([
            // getting the liked tweets!
            {$match : {userId : userid}},
            { $sort : { time : -1 } },
            { $skip: (skip) ? Number(skip) : 0 },
            { $limit: (limit) ? Number(limit) : 5 },
            {
                $lookup:
                {
                    from: "tweets",
                    localField: "tweetId",
                    foreignField: "_id",
                    as: "tweet"
                }
            },
            {
                $project: {
                    tweet : { $arrayElemAt: [ "$tweet", 0 ] }, _id : 0
                }
            },
            {
                $replaceRoot : { newRoot : '$tweet' }
            },


            // adding the usal properties of tweets
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
        ])
        // tweets = await Tweet.aggregate([
        //     { $match: { author: userid } },
        //     { $sort : { "$time" : -1 } },
        //     { $skip: (skip) ? Number(skip) : 0 },
        //     { $limit: (limit) ? Number(limit) : 5 },
        //     {
        //         $lookup:
        //         {
        //             from: "users",
        //             localField: "author",
        //             foreignField: "_id",
        //             pipeline: [
        //                 { $project: { avatar: 1, user_name: 1, name: 1, about: 1 } }
        //             ],

        //             as: "authorDetails"
        //         }
        //     },
        //     {
        //         $lookup:
        //         {
        //             from: "likes",
        //             let: { tweet_author: { $toObjectId: user._id }, tweet_id: { $toObjectId: "$_id" } },
        //             pipeline: [
        //                 {
        //                     $match: {
        //                         $expr: {
        //                             $and: [
        //                                 { $eq: ["$tweetId", "$$tweet_id"] },
        //                                 { $eq: ["$userId", "$$tweet_author"] },
        //                             ]
        //                         }
        //                     },
        //                 },
        //             ],

        //             as: "have_liked"
        //         }
        //     },
        //     {
        //         $lookup:
        //         {
        //             from: "retweets",
        //             let: { tweet_author: { $toObjectId: user._id }, tweet_id: { $toObjectId: "$_id" } },
        //             pipeline: [
        //                 {
        //                     $match: {
        //                         $expr: {
        //                             $and: [
        //                                 { $eq: ["$tweetId", "$$tweet_id"] },
        //                                 { $eq: ["$userId", "$$tweet_author"] },
        //                             ]
        //                         }
        //                     }

        //                 },
        //             ],

        //             as: "have_retweeted"
        //         }
        //     },
        //     {
        //         $set: {
        //             authorDetails: { $arrayElemAt: ["$authorDetails", 0] },
        //             have_liked: { $cond: [{ $gte: [{ $size: '$have_liked' }, 1] }, true, false] },
        //             have_retweeted: { $cond: [{ $gte: [{ $size: '$have_retweeted' }, 1] }, true, false] },
        //             // have_liked : { $arrayElemAt: ["$have_liked", 0] },
        //             // have_retweeted : { $arrayElemAt: ["$have_retweeted", 0] },
        //         }
        //     },
        // ])
    } else {
        tweets = await Tweet.aggregate([
            { $match: { author: userid } },
            { $sort : { "$time" : -1 } },
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
        ])
    }


    if (tweets) {
        res.status(200).json(tweets)
    } else {
        res.status(404).json({ msg: 'User not found' })
    }
}
