import { Link } from "react-router-dom";
import { useState } from "react";
import AddToPlaylistMenu from "../playlist/AddToPlaylistMenu";
import { FaHeart } from "react-icons/fa";

export default function MediaCard({
  video,
  playlists = [],
  onAddToPlaylist,
  showPlaylistMenu = false,
}) {
  const [message, setMessage] = useState("");
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(video.likes || 0);

  const handleAdd = async (playlistId) => {
    if (!onAddToPlaylist) return;
    try {
      setMessage("");
      await onAddToPlaylist(video._id, playlistId);
      setMessage("Saved");
    } catch (err) {
      setMessage(err?.response?.data?.message || "Failed");
    }
  };

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <div className="card p-3 group relative">

      {showPlaylistMenu && (
        <div
          className="absolute right-2 top-2 z-10"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <AddToPlaylistMenu
            playlists={playlists}
            onAdd={handleAdd}
          />
        </div>
      )}

      <Link to={`/watch/${video._id}`} className="block">

        {/* Thumbnail */}
        <div className="aspect-video rounded-xl overflow-hidden relative">
          {video.thumbnail ? (
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-gray-500">
              No thumbnail
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300">
            <span className="text-white text-3xl">▶</span>
          </div>
        </div>

        {/* Title */}
        <div className="mt-3">
          <h3 className="text-sm font-semibold line-clamp-2">
            {video.title}
          </h3>
        </div>
      </Link>

      {/* Channel */}
      <div className="mt-2 flex items-center gap-2">
        {video.owner?.username ? (
          <Link
            to={`/c/${video.owner.username}`}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-cyan-400 transition"
          >
            <span className="h-6 w-6 rounded-full overflow-hidden bg-gray-800">
              {video.owner?.avatar && (
                <img
                  src={video.owner.avatar}
                  alt={video.owner.username}
                  className="h-full w-full object-cover"
                />
              )}
            </span>
            <span>@{video.owner.username}</span>
          </Link>
        ) : (
          <p className="text-xs text-gray-500">Unknown</p>
        )}
      </div>

      {/* Views + Like */}
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-gray-500">
          {video.views} views
        </p>

        <button
          onClick={toggleLike}
          className="flex items-center gap-1 text-sm transition"
        >
          <FaHeart
            className={liked ? "text-red-500" : "text-gray-400"}
          />
          <span className="text-xs">{likes}</span>
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className="mt-1 text-xs text-cyan-400">
          {message}
        </div>
      )}
    </div>
  );
}