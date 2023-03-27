const mongoose = require('mongoose')
const { create_users, UploadUsers, addFollowersFollowings, create_tweets, ModifyUsers, UploadTweets, UpdateUsers } = require('./functions')
const {mongo_url} = require('./secret')


mongoose.connect(mongo_url)
    .then(async () => {
        console.log("Connected to database")
        let users_array = create_users()
        // console.log(users_array)

        let res_ = await UploadUsers(users_array)
        let userids = res_.user_ids
        let users = res_.users
        // console.log(userids)
        users = addFollowersFollowings(userids, users)

        let tweets_array = create_tweets(userids)
        // console.log()
        // console.log(tweets_array)
        let res__ = await UploadTweets(tweets_array)
        let tweetids = res__.tweet_ids
        let tweets = res__.tweets
        users = ModifyUsers(tweetids, tweets, users)

        // console.log(users)
        await UpdateUsers(users)
        // console.log(users)
    })
    .catch((err) => { console.error("Unable to connect database", err) })

// console.log("Connected to database")
// let users_array = create_users()
// // console.log(users_array)
// let users = {}
// users_array.forEach((user, index) => {
//     users[index] = user
// })
// let userids = Object.keys(users)
// console.log(userids)
// // console.log()
// // console.log(users)
// // console.log(new_users)
// let tweets_array = create_tweets(userids)
// console.log()
// // console.log(tweets_array)
// let tweets = {}
// tweets_array.forEach((tweet, index) => {
//     tweets[index] = tweet
// })
// let tweetids = Object.keys(tweets)
// console.log(tweets)
// console.log()
// users = ModifyUsers(tweetids, tweets, users)
// console.log(users)