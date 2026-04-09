import { useEffect, useState } from "react";

import MainLayout from "../layout/MainLayout";
import { getAllVideos } from "../api/video.api";
import VideoGrid from "../components/video/VideoGrid";
import { useAuth } from "../context/AuthContext";
import {
  addVideoToPlaylist,
  getUserPlaylists,
} from "../api/playlist.api";

export default function Home() {
  const { user } = useAuth();

  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);

  const USE_DUMMY = true;

  useEffect(() => {
    loadVideos();
  }, [page]);

  useEffect(() => {
    if (!user?._id) {
      setPlaylists([]);
      return;
    }
    loadPlaylists();
  }, [user?._id]);

  const loadVideos = async () => {
    setLoading(true);

    if (USE_DUMMY) {
      const dummyVideos = [
        {
          _id: "1",
          title: "StreamNest Demo Video",
          thumbnail: "https://picsum.photos/400/250",
          views: 1200,
          owner: {
            username: "ritam",
            avatar: "https://i.pravatar.cc/50",
          },
        },
        {
          _id: "2",
          title: "Frontend UI Showcase",
          thumbnail: "https://picsum.photos/400/251",
          views: 980,
          owner: {
            username: "developer",
            avatar: "https://i.pravatar.cc/51",
          },
        },
        {
          _id: "3",
          title: "React Project Demo",
          thumbnail: "https://picsum.photos/400/252",
          views: 1500,
          owner: {
            username: "coder",
            avatar: "https://i.pravatar.cc/52",
          },
        },
      ];

      setVideos(dummyVideos);
      setHasNext(false);
      setLoading(false);
      return;
    }

    try {
      const res = await getAllVideos({ page, limit: 12 });
      const { videos, total } = res.data.data;

      setVideos((prev) => (page === 1 ? videos : [...prev, ...videos]));
      setHasNext(page * 12 < total);
    } catch (err) {
      console.error("Failed to load videos", err);
    } finally {
      setLoading(false);
    }
  };

  const loadPlaylists = async () => {
    try {
      const res = await getUserPlaylists(user._id);
      setPlaylists(res?.data?.data || []);
    } catch (err) {
      console.error("Failed to load playlists", err);
      setPlaylists([]);
    }
  };

  const handleAddToPlaylist = async (videoId, playlistId) => {
    try {
      await addVideoToPlaylist(videoId, playlistId);
    } catch (err) {
      console.error("Failed to add video to playlist", err);
      throw err;
    }
  };

  return (
    <MainLayout>
      {loading && page === 1 ? (
        <div className="text-neutral-400">
          Loading videos...
        </div>
      ) : videos.length === 0 ? (
        <div className="text-neutral-500">
          No videos available
        </div>
      ) : (
        <>
          <VideoGrid
            videos={videos}
            playlists={playlists}
            onAddToPlaylist={handleAddToPlaylist}
            showPlaylistMenu
          />

          {hasNext && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
}