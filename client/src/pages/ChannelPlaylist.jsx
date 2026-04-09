import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import MainLayout from "../layout/MainLayout";
import EmptyState from "../components/ui/EmptyState";
import VideoGrid from "../components/video/VideoGrid";
import { useAuth } from "../context/AuthContext";

import { getChannelProfile } from "../api/user.api";
import { getAllVideos } from "../api/video.api";
import {
  addVideoToPlaylist,
  getUserPlaylists,
  removeVideoFromPlaylist,
} from "../api/playlist.api";

export default function ChannelPlaylist() {
  const { username, playlistId } = useParams();
  const { user } = useAuth();

  const [channel, setChannel] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [userVideos, setUserVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPlaylistViewData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, playlistId]);

  const selectedPlaylist = useMemo(
    () => playlists.find((playlist) => playlist._id === playlistId),
    [playlists, playlistId]
  );
  const isOwner = !!user && !!channel && String(user._id) === String(channel._id);
  const selectedVideoIds = useMemo(
    () =>
      new Set((selectedPlaylist?.videos || []).map((video) => String(video._id))),
    [selectedPlaylist]
  );
  const addableVideos = useMemo(
    () =>
      userVideos.filter((video) => !selectedVideoIds.has(String(video._id))),
    [userVideos, selectedVideoIds]
  );

  const fetchPlaylistViewData = async () => {
    try {
      setLoading(true);
      setVideosLoading(true);
      setError("");

      const profileRes = await getChannelProfile(username);
      const channelData = profileRes?.data?.data;

      if (!channelData?._id) {
        throw new Error("Channel not found");
      }

      const playlistsRes = await getUserPlaylists(channelData._id);
      setChannel(channelData);
      setPlaylists(playlistsRes?.data?.data || []);

      if (user && String(user._id) === String(channelData._id)) {
        const videosRes = await getAllVideos({
          userId: channelData._id,
          page: 1,
          limit: 100,
          sortBy: "createdAt",
          sortType: "desc",
        });
        setUserVideos(videosRes?.data?.data?.videos || []);
      } else {
        setUserVideos([]);
      }
    } catch (err) {
      setChannel(null);
      setPlaylists([]);
      setUserVideos([]);
      if (err?.response?.status === 401) {
        setError("Login required to view this channel playlist.");
      } else if (err?.response?.status === 404) {
        setError("Channel or playlist not found.");
      } else {
        setError("Failed to load playlist.");
      }
    } finally {
      setLoading(false);
      setVideosLoading(false);
    }
  };

  const refreshPlaylistsOnly = async () => {
    if (!channel?._id) return;
    const playlistsRes = await getUserPlaylists(channel._id);
    setPlaylists(playlistsRes?.data?.data || []);
  };

  const handleAddVideo = async (videoId) => {
    try {
      setActionLoadingId(videoId);
      setError("");
      await addVideoToPlaylist(videoId, playlistId);
      await refreshPlaylistsOnly();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to add video to playlist."
      );
    } finally {
      setActionLoadingId("");
    }
  };

  const handleRemoveVideo = async (videoId) => {
    try {
      setActionLoadingId(videoId);
      setError("");
      await removeVideoFromPlaylist(videoId, playlistId);
      await refreshPlaylistsOnly();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to remove video from playlist."
      );
    } finally {
      setActionLoadingId("");
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="text-neutral-400">Loading playlist...</div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-red-400">{error}</div>
      </MainLayout>
    );
  }

  if (!channel || !selectedPlaylist) {
    return (
      <MainLayout>
        <div className="text-red-400">Playlist not found.</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-neutral-400">
              Channel playlist from @{channel.username}
            </p>
            <h1 className="text-2xl font-semibold">{selectedPlaylist.name}</h1>
            {selectedPlaylist.description && (
              <p className="mt-1 text-sm text-neutral-400">
                {selectedPlaylist.description}
              </p>
            )}
          </div>

          <Link
            to={`/c/${channel.username}`}
            className="rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-800"
          >
            Back to Channel
          </Link>
        </div>

        {isOwner ? (
          <div className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Playlist Videos</h2>

              {selectedPlaylist.videos?.length ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {selectedPlaylist.videos.map((video) => (
                    <article
                      key={video._id}
                      className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3"
                    >
                      <Link to={`/watch/${video._id}`} className="block">
                        <div className="aspect-video rounded-lg overflow-hidden bg-neutral-800">
                          {video.thumbnail ? (
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full grid place-items-center text-xs text-neutral-500">
                              No thumbnail
                            </div>
                          )}
                        </div>
                        <h3 className="mt-2 line-clamp-2 text-sm font-medium">
                          {video.title}
                        </h3>
                      </Link>
                      <button
                        onClick={() => handleRemoveVideo(video._id)}
                        disabled={actionLoadingId === video._id}
                        className="mt-3 rounded-lg border border-red-500/40 px-3 py-1.5 text-xs text-red-300 hover:bg-red-950/40 disabled:opacity-60"
                      >
                        {actionLoadingId === video._id
                          ? "Removing..."
                          : "Remove"}
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No videos in this playlist"
                  description="Add videos from the section below."
                />
              )}
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Add Your Videos</h2>

              {videosLoading ? (
                <div className="text-neutral-400">Loading your videos...</div>
              ) : addableVideos.length === 0 ? (
                <EmptyState
                  title="No videos to add"
                  description="All your videos are already part of this playlist."
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {addableVideos.map((video) => (
                    <article
                      key={video._id}
                      className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3"
                    >
                      <Link to={`/watch/${video._id}`} className="block">
                        <div className="aspect-video rounded-lg overflow-hidden bg-neutral-800">
                          {video.thumbnail ? (
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full grid place-items-center text-xs text-neutral-500">
                              No thumbnail
                            </div>
                          )}
                        </div>
                        <h3 className="mt-2 line-clamp-2 text-sm font-medium">
                          {video.title}
                        </h3>
                      </Link>
                      <button
                        onClick={() => handleAddVideo(video._id)}
                        disabled={actionLoadingId === video._id}
                        className="mt-3 rounded-lg bg-orange-600 px-3 py-1.5 text-xs text-white hover:bg-orange-500 disabled:opacity-60"
                      >
                        {actionLoadingId === video._id ? "Adding..." : "Add"}
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        ) : selectedPlaylist.videos?.length ? (
          <VideoGrid videos={selectedPlaylist.videos} />
        ) : (
          <EmptyState
            title="No videos in this playlist"
            description="This playlist currently has no videos."
          />
        )}
      </div>
    </MainLayout>
  );
}
