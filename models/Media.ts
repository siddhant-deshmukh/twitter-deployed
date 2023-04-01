import mongoose from "mongoose";

export interface IMedia{
    type:"image/png" | "image/jpg" | "image/jpeg" | "image/webp"| "image/gif" | "video", 
    url?:string,
    key?:string,
    size:number,
    // parent_tweet?:mongoose.Types.ObjectId
}
const mediaSchema = new mongoose.Schema<IMedia>({
    // parent_tweet:mongoose.Types.ObjectId,
    type:{type:String,required:true, enum:["image/png" , "image/jpg" , "image/jpeg" , "image/webp","image/gif"]},
    key:{type:String,required:true},
    url:{type:String,required:true},
    size:Number,
})
const Media = mongoose.models.Media || mongoose.model<IMedia>("Media", mediaSchema);
export default Media