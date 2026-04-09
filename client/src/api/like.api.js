import api from "./axios";

// toggle like on video
export const toggleVideoLike = (videoId) =>
  api.post(`/likes/toggle/v/${videoId}`);

// toggle like on comment
export const toggleCommentLike = (commentId) =>
  api.post(`/likes/toggle/c/${commentId}`);

// toggle like on tweet
export const toggleTweetLike = (tweetId) =>
  api.post(`/likes/toggle/t/${tweetId}`);
