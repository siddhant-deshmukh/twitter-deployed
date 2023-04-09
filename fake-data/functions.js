// import { IUserCreate, IUserStored } from "../models/User"
// import { faker } from '@faker-js/faker';
const { faker } = require('@faker-js/faker')
const mongoose = require('mongoose')
const User = require('./User')
const Tweet = require('./Tweet')
const Liked = require('./Liked')
const Retweet = require('./Retweet')

var NUM_USERS = 10
var NUM_TWEETS = 15

function create_users() {
    const Users_array = []
    const TweetsArray = []

    let auth_type = ['google', 'github', 'password']
    // making first users  
    for (var i = 0; i < NUM_USERS; i++) {
        let accounts = new Map()
        for (var j = 0; j < 1 + Math.floor(Math.random() * 1); j++) {
            var a_type = auth_type[Math.floor(Math.random() * auth_type.length)];
            if (a_type === 'github' || a_type === 'google') {
                accounts.set(a_type, { sub: faker.internet.password(5 + Math.floor(Math.random() * 14)) })
            } else {
                accounts.set(a_type, { password: faker.internet.password(5 + Math.floor(Math.random() * 14)) })
            }
        }
        let new_user = {
            name: faker.name.fullName().slice(0, 40),
            user_name: faker.internet.userName().slice(0, 10),
            dob: faker.date.birthdate({ min: 14 }),
            email: faker.internet.email().slice(0, 40),
            avatar: faker.internet.avatar(),
            about: faker.lorem.paragraphs().slice(0, 150),
            followers: [],
            following: [],

            accounts
        }
        Users_array.push(new_user)
    }
    return Users_array
}

async function UploadUsers(Users_array) {
    // console.log(Users_array)
    const user_ids = []
    const users = {}
    await Promise.all(Users_array.map(async (user, index) => {
        // console.log(user)
        const new_user = await User.create(user)
        console.log(new_user._id)
        if (new_user && new_user._id) {
            user_ids.push(new_user._id.toString())
            users[new_user._id.toString()] = new_user
        }

    }))
    // console.log(user_ids)
    return { user_ids, users }
}
function addFollowersFollowings(userIds, users) {
    userIds.forEach((user_id, index) => {
        let followers_index = []
        for (let i = 0; i < Math.floor(Math.random() * userIds.length); i++) {
            let new__ = Math.floor(Math.random() * userIds.length)
            if (new__ !== index && followers_index.findIndex(ele => ele === userIds[new__]) === -1) {
                // console.log(i,index)
                followers_index.push(userIds[new__])
            }
        }
        // console.log(followers_index)
        followers_index.forEach((ind) => {
            // console.log(ind)
            users[user_id]['followers'].push(ind)
            users[ind]['following'].push(user_id)
        })
    })
    return users
}


function create_tweets(userIds, users) {
    const tweets_array = []

    for (var i = 0; i < NUM_TWEETS; i++) {

        let new_tweet = {
            text: faker.lorem.paragraphs().slice(0, 350),
            author: userIds[Math.floor(Math.random() * userIds.length)],
        }
        users[new_tweet.author].num_tweets = (users[new_tweet.author].num_tweets || 0) + 1
        tweets_array.push(new_tweet)
    }
    return { tweets_array, users }
}
async function UploadTweets(tweets_array) {
    // console.log(Users_array)
    const tweet_ids = []
    const tweets = {}
    await Promise.all(tweets_array.map(async (tweet, index) => {
        // console.log(tweet)
        await Tweet.create(tweet).then((new_tweet) => {
            if (new_tweet && new_tweet._id) {
                tweet_ids.push(new_tweet._id.toString())
                tweets[new_tweet._id.toString()] = new_tweet
            }
        })
    }))
    console.log('UploadTweets : ', tweet_ids)
    return { tweet_ids, tweets }
}

var total_comments = 20
function AddCommets(tweets, users) {
    let tweets_id = Object.keys(tweets)
    let users_id = Object.keys(users)
    let comments = []

    for (var i = 0; i < total_comments; i++) {
        let random_tweet_id = tweets_id[Math.floor(Math.random() * 5)]
        let random_user_id = users_id[Math.floor(Math.random() * users_id.length)]
        // let random_tweet_id = tweets_id[Math.floor(Math.random() * 5)]
        let new_tweet = {
            parent_tweet: random_tweet_id,
            text: faker.lorem.paragraphs().slice(0, 350),
            author: random_user_id,
        }
        comments.push(new_tweet)
        tweets[random_tweet_id].num_comments = (tweets[random_tweet_id].num_comments || 0) + 1
    }
    return { comments, tweets }
}
async function UploadComments(comment_array, tweets) {
    const comment_ids = []
    // const tweets = {}
    await Promise.all(comment_array.map(async (tweet, index) => {
        // console.log(tweet)
        await Tweet.create(tweet).then((new_tweet) => {
            if (new_tweet && new_tweet._id) {
                comment_ids.push(new_tweet._id.toString())
                tweets[new_tweet._id.toString()] = new_tweet
            }
        })
    }))
    console.log('UploadComments : ', comment_ids)
    return { comment_ids, tweets }
}

function ModifyUsers(tweets, users) {
    let userIds = Object.keys(users)
    let tweet_ids = Object.keys(tweets)

    tweet_ids.forEach((tweet_id) => {
        // console.log(c_user,tweets[tweet_id]['author'])

        let liked_by = []
        let retweet_by = []
        for (let i = 0; i < Math.floor(Math.random() * 6); i++) {
            let new__ = Math.floor(Math.random() * userIds.length)
            if (liked_by.findIndex(ele => ele === userIds[new__]) === -1) {
                liked_by.push(userIds[new__])
                Liked.create({
                    userId: userIds[new__],
                    tweetId: tweet_id,
                })
            }
        }
        for (let i = 0; i < Math.floor(Math.random() * 4); i++) {
            let new__ = Math.floor(Math.random() * userIds.length)
            if (retweet_by.findIndex(ele => ele === userIds[new__]) === -1) {
                retweet_by.push(userIds[new__])
                Retweet.create({
                    userId: userIds[new__],
                    tweetId: tweet_id,
                })
            }
        }
        tweets[tweet_id].num_likes = liked_by.length
        tweets[tweet_id].num_retweet = retweet_by.length
        Tweet.findByIdAndUpdate(tweet_id, tweets[tweet_id])
            .then((aaa) => {
                // console.log(tweet_id, aaa)
            })
            .catch((err) => {
                // console.log('some err occured',err)
            })
            .finally(() => {
                // console.log("Do something!!")
            })
    })
    console.log('Modify Tweets', tweets)
    return users
}
async function UpdateUsers(users) {
    await Promise.all(Object.keys(users).map(async (user_id) => {
        await User.findByIdAndUpdate(user_id, users[user_id])
    }))
    // console.log('Update Users',users)
}
module.exports = {
    UploadUsers, create_users, addFollowersFollowings, create_tweets, ModifyUsers,
    UploadTweets, UpdateUsers, AddCommets, UploadComments
}

