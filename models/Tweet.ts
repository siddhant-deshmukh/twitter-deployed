import mongoose, { Types } from "mongoose";

export interface ITweetAttachments {
  content_type: "media" | "tweet" | null,
  media?: Types.ObjectId[],
  tweet?: Types.ObjectId,
}
export interface ITweetCreate {
  parent_tweet?: Types.ObjectId | null | string,
  text: string,
  attachments?: ITweetAttachments,
  author: Types.ObjectId | string,
}
export interface ITweetStored extends ITweetCreate {
  _id: Types.ObjectId | string,
  time: Date,


  num_views: number,
  num_comments: number,
  num_quotes: number,
  num_likes: number,
  num_retweet: number,

}
export interface ITweet {
  _id: string,
  parent_tweet?: null | string,
  text: string,
  attachments?: ITweetAttachments,
  author: string,
  time: Date,

  num_views: number,
  num_comments: number,
  num_quotes: number,
  num_likes: number,
  num_retweet: number,

  authorDetails: {
    _id: string,
    name: string,
    user_name: string,
    avatar?: string,
    about?: string
  },
  have_retweeted?: boolean,
  have_liked?: boolean,
}


const contentSchema = new mongoose.Schema<ITweetAttachments>({
  media: [{ type: mongoose.Schema.Types.ObjectId, ref: "Media" }],
  tweet: { type: mongoose.Schema.Types.ObjectId, ref: "Tweet" },
}, { _id: false })

const TweetSchema = new mongoose.Schema<ITweetStored>({
  author: { type: mongoose.Schema.Types.ObjectId, required: true },
  parent_tweet: { type: mongoose.Schema.Types.ObjectId },
  text: { type: String, maxlength: 400, default: "" },
  attachments: contentSchema,


  time: { type: Date, required: true, default: Date.now() },
  num_views: { type: Number, default: 0 },
  num_likes: { type: Number, default: 0 },
  num_retweet: { type: Number, default: 0 },
  num_quotes: { type: Number, default: 0 },
  num_comments: { type: Number, default: 0 }
})

const Tweet = mongoose.models.Tweet || mongoose.model<ITweetStored>("Tweet", TweetSchema);
export default Tweet 