import mongoose, { Types } from "mongoose";

export interface ILiked {
    userId: Types.ObjectId,
    tweetId: Types.ObjectId,
    time: Date,
}
const mediaSchema = new mongoose.Schema<ILiked>({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    tweetId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    time: { type: Date, default : Date.now() }
})
const Liked = mongoose.models.Liked || mongoose.model<ILiked>("Liked", mediaSchema);
export default Liked