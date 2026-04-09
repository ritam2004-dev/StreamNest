import { useAuth } from "../../context/AuthContext";
import useLike from "../../hooks/useLike";
import LikeButton from "../ui/LikeButton";

export default function CommentItem({ comment, onDelete }) {
  const { user } = useAuth();
  const isOwner = user?._id === comment.owner?._id;

  // Like logic via hook (NO API, NO local state)
  const like = useLike({
    type: "comment",
    id: comment._id,
    initialLiked: comment.isLiked,
    initialCount: comment.likesCount,
  });

  return (
    <div className="flex gap-3 py-3">
      {/* Avatar */}
      <div className="h-8 w-8 rounded-full bg-neutral-700 overflow-hidden">
        {comment.owner?.avatar && (
          <img
            src={comment.owner.avatar}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span className="font-medium text-neutral-200">
            @{comment.owner?.username}
          </span>
        </div>

        <p className="mt-1 text-sm text-neutral-300">
          {comment.content}
        </p>

        {/* Actions */}
        <div className="mt-2 flex items-center gap-3">
          <LikeButton
            liked={like.liked}
            count={like.count}
            onClick={like.toggle}
            disabled={!user || like.loading}
          />

          {!user && (
            <span className="text-xs text-neutral-500">
              Login to like
            </span>
          )}
        </div>

        {/* Delete */}
        {isOwner && (
          <button
            onClick={() => onDelete(comment._id)}
            className="mt-1 text-xs text-red-400 hover:text-red-300"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
