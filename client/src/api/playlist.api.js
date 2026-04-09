import api from "./axios";

export const getUserPlaylists = (userId) => {
  return api.get(`/playlists/user/${userId}`);
};

export const createPlaylist = (data) => {
  return api.post("/playlists", data);
};

export const updatePlaylist = (playlistId, data) => {
  return api.patch(`/playlists/${playlistId}`, data);
};

export const deletePlaylist = (playlistId) => {
  return api.delete(`/playlists/${playlistId}`);
};

export const addVideoToPlaylist = (videoId, playlistId) => {
  return api.patch(`/playlists/add/${videoId}/${playlistId}`);
};

export const removeVideoFromPlaylist = (videoId, playlistId) => {
  return api.patch(`/playlists/remove/${videoId}/${playlistId}`);
};
