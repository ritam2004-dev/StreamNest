import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import MainLayout from "../layout/MainLayout";
import EmptyState from "../components/ui/EmptyState";
import VideoGrid from "../components/video/VideoGrid";

import { getAllVideos } from "../api/video.api";
import { searchChannels } from "../api/user.api";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim();

  const [videos, setVideos] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const fetchResults = async () => {
    if (!query) {
      setVideos([]);
      setChannels([]);
      setError("");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [videosRes, channelsRes] = await Promise.all([
        getAllVideos({
          query,
          page: 1,
          limit: 24,
          sortBy: "createdAt",
          sortType: "desc",
        }),
        searchChannels({ query, page: 1, limit: 12 }),
      ]);

      setVideos(videosRes?.data?.data?.videos || []);
      setChannels(channelsRes?.data?.data?.channels || []);
    } catch (err) {
      setError("Failed to fetch search results");
      setVideos([]);
      setChannels([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl font-semibold">
          Search results for "{query || "..."}"
        </h1>

        {!query && (
          <EmptyState
            title="Start searching"
            description="Use the search bar above to find videos or channels."
          />
        )}

        {query && loading && (
          <div className="mt-6 text-neutral-400">Searching...</div>
        )}

        {query && !loading && error && (
          <div className="mt-6 text-red-400">{error}</div>
        )}

        {query && !loading && !error && (
          <div className="mt-8 space-y-10">
            <section>
              <h2 className="text-lg font-medium mb-4">
                Channels
              </h2>

              {channels.length === 0 ? (
                <EmptyState
                  title="No matching channels"
                  description="Try another keyword."
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {channels.map((channel) => (
                    <Link
                      key={channel._id}
                      to={`/c/${channel.username}`}
                      className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 hover:bg-neutral-800 transition"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={channel.avatar}
                          alt={channel.username}
                          className="h-12 w-12 rounded-full object-cover bg-neutral-700"
                        />
                        <div className="min-w-0">
                          <p className="font-medium truncate">
                            {channel.fullName || channel.username}
                          </p>
                          <p className="text-sm text-neutral-400 truncate">
                            @{channel.username}
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">
                            {channel.subscribersCount || 0} subscribers -{" "}
                            {channel.videosCount || 0} videos
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-lg font-medium mb-4">Videos</h2>

              {videos.length === 0 ? (
                <EmptyState
                  title="No matching videos"
                  description="Try another keyword."
                />
              ) : (
                <VideoGrid videos={videos} />
              )}
            </section>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
