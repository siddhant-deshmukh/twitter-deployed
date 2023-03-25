const mongoose = require('mongoose')

const contentSchema = new mongoose.Schema({
    media: [{ type: mongoose.Schema.Types.ObjectId, ref: "Media" }],
    tweet: { type: mongoose.Schema.Types.ObjectId, ref: "Tweet" },
  }, { _id: false })
  
const TweetSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, required: true },
    parent_tweet: { type: mongoose.Schema.Types.ObjectId },
    text: { type: String, maxlength: 400, default: "" },
    attachments : contentSchema,
    
   
    time: { type: Date, required: true, default: Date.now() },
    num_views: { type: Number, default: 0 },
    num_likes: { type: Number, default: 0 },
    num_comments: { type: Number, default: 0 },
    num_retweet: { type: Number, default: 0 },
    num_quotes: { type: Number, default: 0 },
  
    liked_by: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    retweet_by: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    quotes_tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tweet" }],
    comment_tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tweet" }],
  
  })
  
  const Tweet = mongoose.models.Tweet || mongoose.model("Tweet", TweetSchema);
  module.exports = Tweet