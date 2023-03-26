import mongoose,{Types} from "mongoose";

export interface IUserCreate{
    user_name:string,
    name:string,
    email:string,
    
    avatar?:string,
    about?:string,

    accounts:{
        google?:{
            sub?:string,
        },
        password?:{
            password:string,
        },
        github?:{
            sub?:string,
        }
    },
    dob?:Date,
}
export interface IUserStored extends IUserCreate{
    _id:Types.ObjectId,
    
    num_followers?:number,
    num_following?:number,

    num_tweets?:number,
    followers:[Types.ObjectId],
    following:[Types.ObjectId],
    tweets?:[Types.ObjectId],
    likes?:[Types.ObjectId],
    media?:[Types.ObjectId],
    own_tweets_comments?:[Types.ObjectId],
}
export interface IUserSnippet{
    user_name:string,
    name:string,
    _id:string,
    avatar:string,
    about:string,
}
export interface IUser  extends IUserSnippet {
    
    followers:[string],
    following:[string],

    num_followers?:number,
    num_following?:number,
    num_tweets?:number,
    tweets?:[string],
    likes?:[string],
    media?:[string],
    own_tweets_comments?:[string],
}

const UserSchema = new mongoose.Schema<IUserStored>({
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

const User = mongoose.models.User || mongoose.model<IUserStored>("User", UserSchema);
export default User

/**
 
mongoose.Model<IUserStored, {}, {}, {}, mongoose.Document<unknown, {}, IUserStored> & Omit<IUserStored & Required<{
    _id: Types.ObjectId;
}>, never>, any>

 */