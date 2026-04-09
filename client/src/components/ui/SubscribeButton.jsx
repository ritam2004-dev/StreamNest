export default function SubscribeButton({
  subscribed,
  count,
  onClick,
  disabled = false,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg text-sm font-medium transition
        ${
          subscribed
            ? "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
            : "bg-orange-400 text-black hover:bg-orange-500"
        }
        disabled:opacity-60
      `}
    >
      {subscribed ? "Subscribed" : "Subscribe"}
      {typeof count === "number" && (
        <span className="ml-2 text-xs opacity-80">
          {count}
        </span>
      )}
    </button>
  );
}
