const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    email: {type:String,required:true,unique:true,maxLength:40},
    name:{type:String,required:true,maxLength:40},
    accounts: {type:Map,required:true} ,

    user_name : {type:String,maxLength:10,sparse:false,required:true,unique:true},
    dob:{type:Date,max:Date.now()},
    about:{type:String,maxLength:150},

    followers:[{type: mongoose.Schema.Types.ObjectId, ref: 'followers'}],
    following:[{type: mongoose.Schema.Types.ObjectId, ref: 'following'}],
    tweets:[{type: mongoose.Schema.Types.ObjectId, ref: 'tweets'}],
    likes:[{type: mongoose.Schema.Types.ObjectId, ref: 'tweets_liked'}],
    own_tweets_comments:[{type: mongoose.Schema.Types.ObjectId, ref: 'own_tweets'}],
    media:[{type: mongoose.Schema.Types.ObjectId, ref: 'own_tweets'}],
    avatar:{type:String},
})

const User = mongoose.models.User || mongoose.model("User", UserSchema);
module.exports = User