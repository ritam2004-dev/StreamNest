import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import User from "../models/user.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

/**
 * @desc Get all published videos (Home feed)
 */
const getAllVideos = asyncHandler(async (req, res) => {
  console.log("GET VIDEO req.user:", req.user?._id);

  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "updatedAt",
    sortType = "desc",
    userId,
  } = req.query;

  //only published videos for Home
  const filter = {
    isPublished: true,
  };

  if (query) {
    filter.title = { $regex: query, $options: "i" };
  }

  if (userId) {
    filter.owner = userId;
  }

  const sort = {};
  sort[sortBy] = sortType === "asc" ? 1 : -1;

  const videos = await Video.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate("owner", "username avatar");

  const total = await Video.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      { videos, total },
      "Videos fetched successfully"
    )
  );
});

/**
 * @desc Publish (upload) a new video
 */
const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const videoFilePath = req.files?.videoFile?.[0]?.path;
  const thumbnailPath = req.files?.thumbnail?.[0]?.path;

  if (!videoFilePath) {
    throw new ApiError(400, "Video file is required");
  }

  // Upload video
  const uploadedVideo = await uploadOnCloudinary(videoFilePath, "video");

  // Auto thumbnail from video if not uploaded
  let thumbnailUrl = "";

  if (thumbnailPath) {
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailPath, "image");
    thumbnailUrl = uploadedThumbnail?.url || "";
  } else {
    //Cloudinary auto thumbnail (2nd second)
    thumbnailUrl = uploadedVideo.url
      .replace("/upload/", "/upload/so_2,f_jpg/")
      .replace(".mp4", ".jpg");
  }
  const newVideo = await Video.create({
    title,
    description,
    videoFile: uploadedVideo.url,
    public_id: uploadedVideo.public_id,
    thumbnail: thumbnailUrl,
    owner: req.user._id,
    isPublished: true,
    publishedAt: new Date(),
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        newVideo,
        "Video published successfully"
      )
    );
});

/**
 * @desc Get single video by ID
 */
const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  // Count a view whenever this endpoint is opened.
  await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });

  if (req.user?._id) {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { watchHistory: new mongoose.Types.ObjectId(videoId) },
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { watchHistory: new mongoose.Types.ObjectId(videoId) },
    });
  }

  const userId = req.user?._id
    ? new mongoose.Types.ObjectId(req.user._id)
    : null;

  const video = await Video.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(videoId) } },

    { $lookup: { from: "users", localField: "owner", foreignField: "_id", as: "owner" } },
    { $unwind: "$owner" },
    { $addFields: { ownerId: "$owner._id" } },

    { $lookup: { from: "likes", localField: "_id", foreignField: "video", as: "likes" } },
    { $addFields: { likesCount: { $size: "$likes" } } },

    ...(userId
      ? [
        {
          $lookup: {
            from: "likes",
            let: { videoId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$video", "$$videoId"] },
                      { $eq: ["$likedBy", userId] },
                    ],
                  },
                },
              },
            ],
            as: "userLike",
          },
        },
        { $addFields: { isLiked: { $gt: [{ $size: "$userLike" }, 0] } } },
      ]
      : [{ $addFields: { isLiked: false } }]),

    { $lookup: { from: "subscriptions", localField: "ownerId", foreignField: "channel", as: "subs" } },
    { $addFields: { subscribersCount: { $size: "$subs" } } },

    ...(userId
      ? [
        {
          $lookup: {
            from: "subscriptions",
            let: { channelId: "$ownerId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$channel", "$$channelId"] },
                      { $eq: ["$subscriber", userId] },
                    ],
                  },
                },
              },
            ],
            as: "userSub",
          },
        },
        { $addFields: { isSubscribed: { $gt: [{ $size: "$userSub" }, 0] } } },
      ]
      : [{ $addFields: { isSubscribed: false } }]),

    { $project: { likes: 0, userLike: 0, subs: 0, userSub: 0, ownerId: 0 } },
  ]);


  if (!video.length) {
    throw new ApiError(404, "Video not found");
  }

  return res.status(200).json(
    new ApiResponse(200, video[0], "Video fetched successfully")
  );
});


/**
 * @desc Update video details
 */
const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const updateData = { title, description };

  if (req.file) {
    const uploadedThumbnail = await uploadOnCloudinary(
      req.file.path,
      "image"
    );
    if (uploadedThumbnail?.url) {
      updateData.thumbnail = uploadedThumbnail.url;
    }
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    { $set: updateData },
    { new: true }
  );

  if (!updatedVideo) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedVideo,
        "Video updated successfully"
      )
    );
});

/**
 * @desc Delete a video
 */
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const foundVideo = await Video.findById(videoId);
  if (!foundVideo) {
    throw new ApiError(404, "Video not found");
  }

  if (foundVideo.public_id) {
    await deleteFromCloudinary(foundVideo.public_id);
  }

  if (foundVideo.thumbnail) {
    await deleteFromCloudinary(foundVideo.thumbnail, "image");
  }

  await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Video deleted successfully"
      )
    );
});

/**
 * @desc Toggle publish/unpublish video
 */
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const foundVideo = await Video.findById(videoId);
  if (!foundVideo) {
    throw new ApiError(404, "Video not found");
  }

  foundVideo.isPublished = !foundVideo.isPublished;

  // ✅ IMPORTANT: update publish time
  if (foundVideo.isPublished) {
    foundVideo.publishedAt = new Date();
  }

  await foundVideo.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        foundVideo,
        "Video publish status toggled"
      )
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
