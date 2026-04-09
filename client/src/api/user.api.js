import api from "./axios";

export const getChannelProfile = (username) =>
  api.get(`/users/c/${username}`);

export const searchChannels = (params = {}) =>
  api.get("/users/search", { params });

export const updateAccountDetails = (data) =>
  api.patch("/users/update-account", data);

export const updateUserAvatar = (formData) =>
  api.patch("/users/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateUserCoverImage = (formData) =>
  api.patch("/users/cover-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const changePassword = (data) =>
  api.post("/users/change-password", data);

export const getWatchHistory = () =>
  api.get("/users/watch-history");

export const removeVideoFromWatchHistory = (videoId) =>
  api.delete(`/users/watch-history/${videoId}`);

export const clearWatchHistory = () =>
  api.delete("/users/watch-history");
