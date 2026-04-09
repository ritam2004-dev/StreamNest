import { useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useTheme } from "../../context/ThemeContext";

export default function AddToPlaylistMenu({
  playlists = [],
  onAdd,
  disabled = false,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [addingId, setAddingId] = useState("");
  const { theme } = useTheme();

  const handleAdd = async (playlistId) => {
    if (!onAdd || addingId) return;

    try {
      setAddingId(playlistId);
      await onAdd(playlistId);
      setOpen(false);
    } finally {
      setAddingId("");
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
        className={`
          rounded-full p-2 transition disabled:opacity-50
          ${
            theme === "dark"
              ? "text-gray-300 hover:bg-white/10 hover:text-white"
              : "text-gray-700 hover:bg-gray-200"
          }
        `}
        aria-label="Playlist options"
      >
        <HiOutlineDotsVertical className="h-5 w-5" />
      </button>

      {open && (
        <div
          className={`
            absolute right-0 z-20 mt-2 w-56 rounded-lg p-2 shadow-xl
            ${
              theme === "dark"
                ? "bg-neutral-900 border border-neutral-700 text-gray-200"
                : "bg-white border border-gray-200 text-gray-800"
            }
          `}
        >
          <div
            className={`
              px-2 py-1 text-xs
              ${
                theme === "dark"
                  ? "text-gray-400"
                  : "text-gray-500"
              }
            `}
          >
            Save to playlist
          </div>

          {playlists.length === 0 ? (
            <div
              className={`
                px-2 py-2 text-sm
                ${
                  theme === "dark"
                    ? "text-gray-500"
                    : "text-gray-600"
                }
              `}
            >
              No playlists found
            </div>
          ) : (
            playlists.map((playlist) => (
              <button
                key={playlist._id}
                type="button"
                onClick={() => handleAdd(playlist._id)}
                disabled={!!addingId}
                className={`
                  w-full rounded-md px-2 py-2 text-left text-sm transition
                  ${
                    theme === "dark"
                      ? "text-gray-200 hover:bg-neutral-800"
                      : "text-gray-800 hover:bg-gray-100"
                  }
                  disabled:opacity-60
                `}
              >
                {addingId === playlist._id
                  ? "Saving..."
                  : playlist.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}