// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../lib/dbConnect'
import mongoose from 'mongoose'
import Tweet, { ITweet } from '../../models/Tweet'
import User from '../../models/User'
import { getUserSession } from '@/lib/getUserFromToken'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

type Data = ITweet[]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const {
    body,
    method
  } = req
  await dbConnect()

  const user = await getUserSession(req, res)
  if (!user) {
    // return res.status(401).json({ msg: 'error in token!!' })
    console.log("Getting temp")
    let temp_user = await User.findById('64219d64a6a5b870d5753c02').select({accounts : 0})
    if (temp_user && temp_user._id) {
      const token = jwt.sign({ _id: temp_user._id.toString(), email: temp_user.email }, process.env.TOKEN_KEY || 'zhingalala', { expiresIn: '2h' })
      res.setHeader('Set-Cookie', serialize('auth-token', token, {
        httpOnly: false,
        maxAge: 60 * 60 * 100000,
        sameSite: 'strict',
        path: '/'
      }))
      return res.status(200).json(temp_user)
    }else{
      return res.status(500).json({msg:'Some error occured!'})
    }
  }

  return res.status(200).json(user)
}
