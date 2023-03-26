// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../lib/dbConnect'
import mongoose from 'mongoose'
import Tweet from '../../models/Tweet'
import User from '../../models/User'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const {
    body,
    method
  } = req
  await dbConnect()

  const data = await Tweet.aggregate([
    { $limit:5 },
    { $sort : { _id : -1 } }
  ])
  res.status(200).json({ name: 'John Doe',data })
}
