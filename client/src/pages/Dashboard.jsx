import { useEffect, useState } from "react";

import MainLayout from "../layout/MainLayout";

import {
  getDashboardStats,
  getDashboardVideos,
} from "../api/dashboard.api";

import {
  togglePublishVideo,
  deleteVideo,
} from "../api/video.api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [statsRes, videosRes] = await Promise.all([
        getDashboardStats(),
        getDashboardVideos(),
      ]);

      setStats(statsRes.data.data || {});
      setVideos(videosRes.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (videoId) => {
    try {
      await togglePublishVideo(videoId);

      setVideos((prev) =>
        prev.map((v) =>
          v._id === videoId
            ? { ...v, isPublished: !v.isPublished }
            : v
        )
      );
    } catch (err) {
      console.error("Failed to toggle publish");
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!confirm("Are you sure you want to delete this video?")) {
      return;
    }

    try {
      await deleteVideo(videoId);
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
    } catch (err) {
      console.error("Failed to delete video");
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="text-neutral-400">
          Loading dashboard…
        </div>
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

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl font-semibold mb-6">
          Creator Dashboard
        </h1>

        {/* ===== Stats ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Videos"
            value={stats?.totalVideos ?? 0}
          />
          <StatCard
            label="Views"
            value={stats?.totalViews ?? 0}
          />
          <StatCard
            label="Likes"
            value={stats?.totalLikes ?? 0}
          />
          <StatCard
            label="Subscribers"
            value={stats?.subscribersCount ?? 0}
          />
        </div>

        {/* ===== Videos Table ===== */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="py-2 text-left">Title</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {videos.map((video) => (
                <tr
                  key={video._id}
                  className="border-b border-neutral-800"
                >
                  <td className="py-3">
                    {video.title}
                  </td>

                  <td className="py-3 text-center">
                    {video.isPublished ? (
                      <span className="text-green-400">
                        Published
                      </span>
                    ) : (
                      <span className="text-yellow-400">
                        Unpublished
                      </span>
                    )}
                  </td>

                  <td className="py-3 text-center space-x-3">
                    <button
                      onClick={() =>
                        handleTogglePublish(video._id)
                      }
                      className="text-orange-400 hover:underline"
                    >
                      {video.isPublished
                        ? "Unpublish"
                        : "Publish"}
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteVideo(video._id)
                      }
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {videos.length === 0 && (
            <div className="text-neutral-500 mt-6">
              You haven’t uploaded any videos yet.
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
      <div className="text-sm text-neutral-400">
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold">
        {value}
      </div>
    </div>
  );
}
