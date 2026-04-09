import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import MainLayout from "../layout/MainLayout";
import EmptyState from "../components/ui/EmptyState";
import { useAuth } from "../context/AuthContext";
import {
  changePassword,
  clearWatchHistory,
  getWatchHistory,
  removeVideoFromWatchHistory,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../api/user.api";

export default function Profile() {
  const { user, setUser } = useAuth();

  const [accountForm, setAccountForm] = useState({
    fullname: "",
    email: "",
    username: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [watchHistory, setWatchHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const [savingAccount, setSavingAccount] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const [updatingCover, setUpdatingCover] = useState(false);
  const [clearingHistory, setClearingHistory] = useState(false);
  const [removingHistoryId, setRemovingHistoryId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user) return;
    setAccountForm({
      fullname: user.fullName || "",
      email: user.email || "",
      username: user.username || "",
    });
  }, [user]);

  useEffect(() => {
    fetchWatchHistory();
  }, []);

  const historyCountLabel = useMemo(() => {
    const count = watchHistory.length;
    return `${count} video${count === 1 ? "" : "s"}`;
  }, [watchHistory.length]);

  const fetchWatchHistory = async () => {
    try {
      setHistoryLoading(true);
      const res = await getWatchHistory();
      setWatchHistory(res?.data?.data || []);
    } catch {
      setWatchHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      fullname: accountForm.fullname.trim(),
      email: accountForm.email.trim(),
      username: accountForm.username.trim(),
    };

    if (!payload.fullname || !payload.email || !payload.username) return;

    try {
      setSavingAccount(true);
      setError("");
      setSuccess("");

      const res = await updateAccountDetails(payload);
      const updatedUser = res?.data?.data;
      if (updatedUser) {
        setUser(updatedUser);
      }

      setSuccess("Profile details updated.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile details");
    } finally {
      setSavingAccount(false);
    }
  };

  const handleAvatarChange = async (file) => {
    if (!file) return;

    try {
      setUpdatingAvatar(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("avatar", file);

      const res = await updateUserAvatar(formData);
      const updatedUser = res?.data?.data;
      if (updatedUser) setUser(updatedUser);

      setSuccess("Profile picture updated.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update avatar");
    } finally {
      setUpdatingAvatar(false);
    }
  };

  const handleCoverChange = async (file) => {
    if (!file) return;

    try {
      setUpdatingCover(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("coverImage", file);

      const res = await updateUserCoverImage(formData);
      const updatedUser = res?.data?.data;
      if (updatedUser) setUser(updatedUser);

      setSuccess("Cover image updated.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update cover image");
    } finally {
      setUpdatingCover(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      oldPassword: passwordForm.oldPassword.trim(),
      newPassword: passwordForm.newPassword.trim(),
    };

    if (!payload.oldPassword || !payload.newPassword) return;

    try {
      setSavingPassword(true);
      setError("");
      setSuccess("");

      await changePassword(payload);
      setPasswordForm({ oldPassword: "", newPassword: "" });
      setSuccess("Password updated successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleRemoveHistoryItem = async (videoId) => {
    try {
      setRemovingHistoryId(videoId);
      setError("");
      await removeVideoFromWatchHistory(videoId);
      setWatchHistory((prev) =>
        prev.filter((video) => String(video._id) !== String(videoId))
      );
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to remove history item");
    } finally {
      setRemovingHistoryId("");
    }
  };

  const handleClearHistory = async () => {
    const accepted = window.confirm("Clear full watch history?");
    if (!accepted) return;

    try {
      setClearingHistory(true);
      setError("");
      await clearWatchHistory();
      setWatchHistory([]);
      setSuccess("Watch history cleared.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to clear watch history");
    } finally {
      setClearingHistory(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <section className="glass-panel rounded-2xl overflow-hidden">
          <div className="relative h-44 bg-neutral-800">
            {user?.coverImage ? (
              <img
                src={user.coverImage}
                alt="cover"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-neutral-800 to-neutral-700" />
            )}

            <label className="absolute right-4 top-4 cursor-pointer rounded-lg border border-neutral-700 bg-neutral-950/90 px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-800">
              {updatingCover ? "Updating..." : "Update Cover"}
              <input
                type="file"
                accept="image/*"
                disabled={updatingCover}
                onChange={(e) => handleCoverChange(e.target.files?.[0])}
                className="hidden"
              />
            </label>
          </div>

          <div className="px-6 pb-6">
            <div className="-mt-12 flex items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <div className="relative h-24 w-24 rounded-full border-4 border-neutral-950 bg-neutral-800 overflow-hidden">
                  {user?.avatar && (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="pb-2">
                  <h1 className="text-2xl font-semibold">{user?.fullName}</h1>
                  <p className="text-sm text-neutral-400">@{user?.username}</p>
                </div>
              </div>

              <label className="cursor-pointer rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-800">
                {updatingAvatar ? "Updating..." : "Update Picture"}
                <input
                  type="file"
                  accept="image/*"
                  disabled={updatingAvatar}
                  onChange={(e) => handleAvatarChange(e.target.files?.[0])}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </section>

        {(error || success) && (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${
              error
                ? "border border-red-500/40 bg-red-950/40 text-red-300"
                : "border border-emerald-500/40 bg-emerald-950/30 text-emerald-300"
            }`}
          >
            {error || success}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-2">
          <form
            onSubmit={handleAccountSubmit}
            className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4"
          >
            <h2 className="text-lg font-semibold">Channel Details</h2>

            <div>
              <label className="block text-sm text-neutral-400 mb-1">Full Name</label>
              <input
                type="text"
                value={accountForm.fullname}
                onChange={(e) =>
                  setAccountForm((prev) => ({ ...prev, fullname: e.target.value }))
                }
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-1">Username</label>
              <input
                type="text"
                value={accountForm.username}
                onChange={(e) =>
                  setAccountForm((prev) => ({ ...prev, username: e.target.value }))
                }
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-1">Email</label>
              <input
                type="email"
                value={accountForm.email}
                onChange={(e) =>
                  setAccountForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={savingAccount}
              className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500 disabled:opacity-60"
            >
              {savingAccount ? "Saving..." : "Save Changes"}
            </button>
          </form>

          <form
            onSubmit={handlePasswordSubmit}
            className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4"
          >
            <h2 className="text-lg font-semibold">Change Password</h2>

            <div>
              <label className="block text-sm text-neutral-400 mb-1">Old Password</label>
              <input
                type="password"
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, oldPassword: e.target.value }))
                }
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-1">New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                }
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500 disabled:opacity-60"
            >
              {savingPassword ? "Updating..." : "Update Password"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Watch History</h2>
              <p className="text-sm text-neutral-400">{historyCountLabel}</p>
            </div>

            <button
              onClick={handleClearHistory}
              disabled={clearingHistory || watchHistory.length === 0}
              className="rounded-lg border border-red-500/40 px-3 py-2 text-xs text-red-300 hover:bg-red-950/40 disabled:opacity-60"
            >
              {clearingHistory ? "Clearing..." : "Clear History"}
            </button>
          </div>

          {historyLoading ? (
            <div className="text-neutral-400">Loading watch history...</div>
          ) : watchHistory.length === 0 ? (
            <EmptyState
              title="No watch history yet"
              description="Videos you watch will appear here."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {watchHistory.map((video) => (
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
                    <h3 className="mt-2 text-sm font-medium line-clamp-2">{video.title}</h3>
                    <p className="mt-1 text-xs text-neutral-500">
                      @{video.owner?.username || "unknown"}
                    </p>
                  </Link>

                  <button
                    onClick={() => handleRemoveHistoryItem(video._id)}
                    disabled={removingHistoryId === video._id}
                    className="mt-3 rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 disabled:opacity-60"
                  >
                    {removingHistoryId === video._id ? "Removing..." : "Remove"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
