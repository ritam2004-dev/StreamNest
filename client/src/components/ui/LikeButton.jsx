import { AiFillLike, AiOutlineLike } from "react-icons/ai";

export default function LikeButton({
  liked,
  count,
  onClick,
  disabled,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1 text-sm text-neutral-300 hover:text-orange-500 transition disabled:opacity-50"
    >
      {liked ? <AiFillLike /> : <AiOutlineLike />}
      <span>{count}</span>
    </button>
  );
}
