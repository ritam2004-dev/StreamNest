import axios from "./axios";

// Channel statistics (views, likes, subscribers, videos)
export const getDashboardStats = () => {
  return axios.get("/dashboard/stats");
};

// Creator's uploaded videos
export const getDashboardVideos = () => {
  return axios.get("/dashboard/videos");
};
