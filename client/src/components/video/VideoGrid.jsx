import MediaCard from "./MediaCard";

export default function VideoGrid({
  videos = [],
  playlists = [],
  onAddToPlaylist,
  showPlaylistMenu = false,
}) {
  if (!videos.length) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {videos.map((video) => (
        <MediaCard
          key={video._id}
          video={video}
          playlists={playlists}
          onAddToPlaylist={onAddToPlaylist}
          showPlaylistMenu={showPlaylistMenu}
        />
      ))}
    </div>
  );
}
