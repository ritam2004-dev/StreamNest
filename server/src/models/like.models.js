import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    tweet: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

likeSchema.pre("save", function (next) {
  const targets = [this.video, this.comment, this.tweet].filter(Boolean);
  if (targets.length !== 1) {
    return next(new Error("Like must reference exactly one target"));
  }
  next();
});

export const Like = mongoose.model("Like", likeSchema);
