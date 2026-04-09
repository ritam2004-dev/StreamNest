export default function VideoPlayer({ src }) {
  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
      <video
        src={src}
        controls
        className="w-full h-full"
      />
    </div>
  );
}
