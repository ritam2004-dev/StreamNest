import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import MainLayout from "../layout/MainLayout";
import { useAuth } from "../context/AuthContext";

import useSubscribe from "../hooks/useSubscribe";
import SubscribeButton from "../components/ui/SubscribeButton";
import EmptyState from "../components/ui/EmptyState";

import { getAllVideos } from "../api/video.api";
import { getChannelProfile } from "../api/user.api";
import { getUserPlaylists } from "../api/playlist.api";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "../api/tweet.api";
import VideoGrid from "../components/video/VideoGrid";

const MAX_POST_LENGTH = 280;

export default function Channel() {
  const { username } = useParams();
  const { user } = useAuth();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [editingPostId, setEditingPostId] = useState("");
  const [editingPostContent, setEditingPostContent] = useState("");

  const [activeTab, setActiveTab] = useState("videos");
  const [loading, setLoading] = useState(true);
  const [playlistsLoading, setPlaylistsLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);

  const [posting, setPosting] = useState(false);
  const [postActionLoading, setPostActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [playlistsError, setPlaylistsError] = useState("");
  const [postsError, setPostsError] = useState("");

  useEffect(() => {
    fetchChannelData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const isOwner = !!user && String(user._id) === String(channel?._id);
  const postRemainingChars = MAX_POST_LENGTH - postContent.length;

  const fetchChannelData = async () => {
    try {
      setLoading(true);
      setPlaylistsLoading(true);
      setPostsLoading(true);

      setError("");
      setPlaylistsError("");
      setPostsError("");

      const profileRes = await getChannelProfile(username);
      const channelData = profileRes?.data?.data;

      if (!channelData?._id) {
        throw new Error("Channel not found");
      }

      setChannel(channelData);

      const [videosRes, playlistsRes, postsRes] = await Promise.allSettled([
        getAllVideos({
          userId: channelData._id,
          page: 1,
          limit: 24,
          sortBy: "createdAt",
          sortType: "desc",
        }),
        getUserPlaylists(channelData._id),
        getUserTweets(channelData._id),
      ]);

      if (videosRes.status === "fulfilled") {
        setVideos(videosRes.value?.data?.data?.videos || []);
      } else {
        setVideos([]);
      }

      if (playlistsRes.status === "fulfilled") {
        setPlaylists(playlistsRes.value?.data?.data || []);
      } else {
        setPlaylists([]);
        if (playlistsRes.reason?.response?.status === 401) {
          setPlaylistsError("Login to view channel playlists.");
        } else {
          setPlaylistsError("Failed to load playlists.");
        }
      }

      if (postsRes.status === "fulfilled") {
        setPosts(postsRes.value?.data?.data || []);
      } else {
        setPosts([]);
        if (postsRes.reason?.response?.status === 401) {
          setPostsError("Login to view channel posts.");
        } else {
          setPostsError("Failed to load posts.");
        }
      }
    } catch (err) {
      setError(
        err?.response?.status === 404
          ? "Channel not found"
          : "Failed to load channel"
      );
      setChannel(null);
      setVideos([]);
      setPlaylists([]);
      setPosts([]);
    } finally {
      setLoading(false);
      setPlaylistsLoading(false);
      setPostsLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const content = postContent.trim();
    if (!content || content.length > MAX_POST_LENGTH) return;

    try {
      setPosting(true);
      setPostsError("");

      const res = await createTweet(content);
      const createdPost = res?.data?.data;

      if (createdPost?._id) {
        setPosts((prev) => [createdPost, ...prev]);
      } else {
        const postsRes = await getUserTweets(channel._id);
        setPosts(postsRes?.data?.data || []);
      }

      setPostContent("");
    } catch (err) {
      setPostsError(
        err?.response?.data?.message || "Failed to create post"
      );
    } finally {
      setPosting(false);
    }
  };

  const startEditPost = (post) => {
    setEditingPostId(post._id);
    setEditingPostContent(post.content || "");
  };

  const cancelEditPost = () => {
    setEditingPostId("");
    setEditingPostContent("");
  };

  const handleUpdatePost = async (postId) => {
    const content = editingPostContent.trim();
    if (!content || content.length > MAX_POST_LENGTH) return;

    try {
      setPostActionLoading(true);
      setPostsError("");

      const res = await updateTweet(postId, content);
      const updatedPost = res?.data?.data;

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, ...updatedPost } : post
        )
      );
      cancelEditPost();
    } catch (err) {
      setPostsError(
        err?.response?.data?.message || "Failed to update post"
      );
    } finally {
      setPostActionLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    const confirmed = window.confirm("Delete this post?");
    if (!confirmed) return;

    try {
      setPostActionLoading(true);
      setPostsError("");
      await deleteTweet(postId);
      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (err) {
      setPostsError(
        err?.response?.data?.message || "Failed to delete post"
      );
    } finally {
      setPostActionLoading(false);
    }
  };

  const subscribe = useSubscribe({
    channelId: channel?._id,
    initialSubscribed: channel?.isSubscribed,
    initialCount: channel?.subscribersCount,
  });

  if (loading) {
    return (
      <MainLayout>
        <div className="text-neutral-400">Loading channel...</div>
      </MainLayout>
    );
  }

  if (error || !channel) {
    return (
      <MainLayout>
        <div className="text-red-400">
          {error || "Channel not found"}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 py-6 border-b border-neutral-800">
          <div className="h-20 w-20 rounded-full bg-neutral-700 overflow-hidden">
            {channel.avatar && (
              <img
                src={channel.avatar}
                alt={channel.username}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-xl font-semibold">@{channel.username}</h1>
            <p className="text-sm text-neutral-400">
              {subscribe.count} subscribers
            </p>
          </div>

          {user && String(user._id) !== String(channel._id) && (
            <SubscribeButton
              subscribed={subscribe.subscribed}
              count={subscribe.count}
              onClick={subscribe.toggle}
              disabled={subscribe.loading}
            />
          )}

          {!user && (
            <span className="text-sm text-neutral-500">Login to subscribe</span>
          )}
        </div>

        <div className="flex gap-6 border-b border-neutral-800 mt-4">
          <button
            onClick={() => setActiveTab("videos")}
            className={`pb-2 text-sm font-medium transition ${
              activeTab === "videos"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Videos
          </button>

          <button
            onClick={() => setActiveTab("playlists")}
            className={`pb-2 text-sm font-medium transition ${
              activeTab === "playlists"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Playlists
          </button>

          <button
            onClick={() => setActiveTab("posts")}
            className={`pb-2 text-sm font-medium transition ${
              activeTab === "posts"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Posts
          </button>
        </div>

        <div className="mt-6">
          {activeTab === "videos" && (
            <>
              {videos.length > 0 ? (
                <VideoGrid videos={videos} />
              ) : (
                <EmptyState
                  title="No videos yet"
                  description="This channel has not uploaded any videos."
                />
              )}
            </>
          )}

          {activeTab === "playlists" && (
            <>
              {playlistsError && (
                <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {playlistsError}
                </div>
              )}

              {playlistsLoading ? (
                <div className="text-sm text-neutral-400">Loading playlists...</div>
              ) : playlists.length === 0 ? (
                <EmptyState
                  title="No playlists"
                  description="This channel has not created any playlists yet."
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {playlists.map((playlist) => {
                    const videosCount = playlist.videos?.length || 0;
                    const previewThumbnail =
                      playlist.videos?.[0]?.thumbnail || "";

                    return (
                      <Link
                        key={playlist._id}
                        to={`/c/${channel.username}/playlists/${playlist._id}`}
                        className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4"
                      >
                        <div className="aspect-video rounded-xl overflow-hidden bg-neutral-800">
                          {previewThumbnail ? (
                            <img
                              src={previewThumbnail}
                              alt={playlist.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full grid place-items-center text-xs text-neutral-500">
                              No preview
                            </div>
                          )}
                        </div>

                        <h3 className="mt-3 text-base font-semibold text-neutral-100">
                          {playlist.name}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-neutral-400">
                          {playlist.description}
                        </p>
                        <p className="mt-2 text-xs text-neutral-500">
                          {videosCount} video{videosCount === 1 ? "" : "s"}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {activeTab === "posts" && (
            <div className="max-w-3xl space-y-4">
              {isOwner && (
                <form
                  onSubmit={handleCreatePost}
                  className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4"
                >
                  <div className="flex gap-3">
                    <img
                      src={channel.avatar}
                      alt={channel.username}
                      className="h-10 w-10 rounded-full object-cover bg-neutral-800"
                    />
                    <div className="flex-1">
                      <textarea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        maxLength={MAX_POST_LENGTH}
                        rows={4}
                        placeholder="Share something with your audience..."
                        className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-950 p-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                      />
                      <div className="mt-3 flex items-center justify-between">
                        <span
                          className={`text-xs ${
                            postRemainingChars < 20
                              ? "text-orange-400"
                              : "text-neutral-500"
                          }`}
                        >
                          {postRemainingChars} / {MAX_POST_LENGTH}
                        </span>
                        <button
                          type="submit"
                          disabled={
                            posting ||
                            postActionLoading ||
                            !postContent.trim() ||
                            postContent.trim().length > MAX_POST_LENGTH
                          }
                          className="rounded-full bg-orange-500 px-5 py-2 text-sm font-medium text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {posting ? "Posting..." : "Post"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {postsError && (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {postsError}
                </div>
              )}

              {postsLoading ? (
                <div className="text-sm text-neutral-400">Loading posts...</div>
              ) : posts.length === 0 ? (
                <EmptyState
                  title="No posts yet"
                  description="Channel posts will appear here."
                />
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => {
                    const isEditing = editingPostId === post._id;
                    const editRemainingChars =
                      MAX_POST_LENGTH - editingPostContent.length;

                    return (
                      <article
                        key={post._id}
                        className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4"
                      >
                        <div className="flex gap-3">
                          <img
                            src={channel.avatar}
                            alt={channel.username}
                            className="h-10 w-10 rounded-full object-cover bg-neutral-800"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-medium text-neutral-100 truncate">
                                  {channel.fullName || channel.username}
                                </p>
                                <p className="text-xs text-neutral-500">
                                  @{channel.username} | {new Date(post.createdAt).toLocaleString()}
                                </p>
                              </div>

                              {isOwner && !isEditing && (
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => startEditPost(post)}
                                    disabled={posting || postActionLoading}
                                    className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-200 hover:bg-neutral-800 disabled:opacity-60"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeletePost(post._id)}
                                    disabled={posting || postActionLoading}
                                    className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10 disabled:opacity-60"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>

                            {isEditing ? (
                              <>
                                <textarea
                                  value={editingPostContent}
                                  onChange={(e) =>
                                    setEditingPostContent(e.target.value)
                                  }
                                  maxLength={MAX_POST_LENGTH}
                                  rows={4}
                                  className="mt-3 w-full resize-none rounded-xl border border-neutral-700 bg-neutral-950 p-3 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                                />
                                <div className="mt-3 flex items-center justify-between">
                                  <span
                                    className={`text-xs ${
                                      editRemainingChars < 20
                                        ? "text-orange-400"
                                        : "text-neutral-500"
                                    }`}
                                  >
                                    {editRemainingChars} / {MAX_POST_LENGTH}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={cancelEditPost}
                                      disabled={postActionLoading}
                                      className="rounded-full border border-neutral-700 px-4 py-1.5 text-sm text-neutral-200 hover:bg-neutral-800 disabled:opacity-60"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleUpdatePost(post._id)}
                                      disabled={
                                        postActionLoading ||
                                        !editingPostContent.trim() ||
                                        editingPostContent.trim().length > MAX_POST_LENGTH
                                      }
                                      className="rounded-full bg-orange-500 px-4 py-1.5 text-sm font-medium text-black hover:bg-orange-400 disabled:opacity-60"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-neutral-100">
                                {post.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
