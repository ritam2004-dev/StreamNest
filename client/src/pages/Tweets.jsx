import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import MainLayout from "../layout/MainLayout";
import { useAuth } from "../context/AuthContext";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "../api/tweet.api";

const MAX_TWEET_LENGTH = 280;

export default function Tweets() {
  const { user } = useAuth();

  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState("");
  const [editingId, setEditingId] = useState("");
  const [editingContent, setEditingContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?._id) return;
    fetchTweets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const remainingNewChars = useMemo(
    () => MAX_TWEET_LENGTH - newTweet.length,
    [newTweet.length]
  );

  const fetchTweets = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getUserTweets(user._id);
      setTweets(res?.data?.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load tweets"
      );
      setTweets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTweet = async (e) => {
    e.preventDefault();
    const content = newTweet.trim();
    if (!content || content.length > MAX_TWEET_LENGTH) return;

    try {
      setSubmitting(true);
      const res = await createTweet(content);
      const createdTweet = res?.data?.data;
      if (createdTweet?._id) {
        setTweets((prev) => [createdTweet, ...prev]);
      } else {
        fetchTweets();
      }
      setNewTweet("");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to create tweet"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (tweet) => {
    setEditingId(tweet._id);
    setEditingContent(tweet.content);
  };

  const cancelEdit = () => {
    setEditingId("");
    setEditingContent("");
  };

  const handleUpdateTweet = async (tweetId) => {
    const content = editingContent.trim();
    if (!content || content.length > MAX_TWEET_LENGTH) return;

    try {
      setSubmitting(true);
      const res = await updateTweet(tweetId, content);
      const updatedTweet = res?.data?.data;
      setTweets((prev) =>
        prev.map((tweet) =>
          tweet._id === tweetId ? { ...tweet, ...updatedTweet } : tweet
        )
      );
      cancelEdit();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to update tweet"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    try {
      setSubmitting(true);
      await deleteTweet(tweetId);
      setTweets((prev) => prev.filter((tweet) => tweet._id !== tweetId));
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to delete tweet"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar}
              alt={user?.username}
              className="h-16 w-16 rounded-full object-cover bg-neutral-800"
            />
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-semibold truncate">
                {user?.fullName || user?.username}
              </h1>
              <p className="text-sm text-neutral-400 truncate">
                @{user?.username}
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-6 border-b border-neutral-800 text-sm">
            <Link
              to={`/c/${user?.username}`}
              className="pb-2 text-neutral-400 hover:text-neutral-200 transition"
            >
              Videos
            </Link>
            <Link
              to={`/c/${user?.username}`}
              className="pb-2 text-neutral-400 hover:text-neutral-200 transition"
            >
              Playlists
            </Link>
            <span className="pb-2 border-b-2 border-orange-500 text-orange-400 font-medium">
              Posts
            </span>
          </div>
        </div>

        <div className="mt-6 max-w-3xl mx-auto space-y-4">
          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form
            onSubmit={handleCreateTweet}
            className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4"
          >
            <div className="flex gap-3">
              <img
                src={user?.avatar}
                alt={user?.username}
                className="h-10 w-10 rounded-full object-cover bg-neutral-800"
              />
              <div className="flex-1">
                <textarea
                  value={newTweet}
                  onChange={(e) => setNewTweet(e.target.value)}
                  maxLength={MAX_TWEET_LENGTH}
                  rows={4}
                  placeholder="Share something with your audience..."
                  className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-950 p-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                />
                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={`text-xs ${
                      remainingNewChars < 20
                        ? "text-orange-400"
                        : "text-neutral-500"
                    }`}
                  >
                    {remainingNewChars} / {MAX_TWEET_LENGTH}
                  </span>
                  <button
                    type="submit"
                    disabled={
                      submitting ||
                      !newTweet.trim() ||
                      newTweet.trim().length > MAX_TWEET_LENGTH
                    }
                    className="rounded-full bg-orange-500 px-5 py-2 text-sm font-medium text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Posting..." : "Post"}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {loading ? (
            <div className="text-sm text-neutral-400">Loading posts...</div>
          ) : tweets.length === 0 ? (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-8 text-center text-sm text-neutral-400">
              No posts yet.
            </div>
          ) : (
            <div className="space-y-4">
              {tweets.map((tweet) => {
                const isEditing = editingId === tweet._id;
                const remainingEditChars =
                  MAX_TWEET_LENGTH - editingContent.length;

                return (
                  <article
                    key={tweet._id}
                    className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4"
                  >
                    <div className="flex gap-3">
                      <img
                        src={user?.avatar}
                        alt={user?.username}
                        className="h-10 w-10 rounded-full object-cover bg-neutral-800"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-neutral-100 truncate">
                              {user?.fullName || user?.username}
                            </p>
                            <p className="text-xs text-neutral-500">
                              @{user?.username} •{" "}
                              {new Date(tweet.createdAt).toLocaleString()}
                            </p>
                          </div>
                          {!isEditing && (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => startEdit(tweet)}
                                disabled={submitting}
                                className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-200 hover:bg-neutral-800 disabled:opacity-60"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteTweet(tweet._id)}
                                disabled={submitting}
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
                              value={editingContent}
                              onChange={(e) =>
                                setEditingContent(e.target.value)
                              }
                              maxLength={MAX_TWEET_LENGTH}
                              rows={4}
                              className="mt-3 w-full resize-none rounded-xl border border-neutral-700 bg-neutral-950 p-3 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                            />
                            <div className="mt-3 flex items-center justify-between">
                              <span
                                className={`text-xs ${
                                  remainingEditChars < 20
                                    ? "text-orange-400"
                                    : "text-neutral-500"
                                }`}
                              >
                                {remainingEditChars} / {MAX_TWEET_LENGTH}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={cancelEdit}
                                  disabled={submitting}
                                  className="rounded-full border border-neutral-700 px-4 py-1.5 text-sm text-neutral-200 hover:bg-neutral-800 disabled:opacity-60"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateTweet(tweet._id)
                                  }
                                  disabled={
                                    submitting ||
                                    !editingContent.trim() ||
                                    editingContent.trim().length >
                                      MAX_TWEET_LENGTH
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
                            {tweet.content}
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
      </div>
    </MainLayout>
  );
}
