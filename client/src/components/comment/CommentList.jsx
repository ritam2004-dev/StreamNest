import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getVideoComments,
  addComment,
  deleteComment,
} from "../../api/comment.api";
import CommentItem from "./CommentItem";

export default function CommentList({ videoId }) {
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (videoId) {
    fetchComments();
  }
}, [videoId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await getVideoComments(videoId);
      setComments(res.data.data.comments || []);
    } catch (err) {
      console.error("Failed to load comments", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!content.trim()) return;

    try {
      const res = await addComment(videoId, content);
      setComments((prev) => [res.data.data, ...prev]);
      setContent("");
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments((prev) =>
        prev.filter((c) => c._id !== commentId)
      );
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-sm font-semibold mb-4">
        Comments
      </h2>

      {/* Add comment */}
      {user ? (
        <div className="flex gap-3 mb-6">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment…"
            className="
              flex-1 px-3 py-2 rounded-lg
              bg-neutral-800 border border-neutral-700
              text-sm placeholder:text-neutral-500
              focus:outline-none focus:ring-2 focus:ring-orange-400/40
            "
          />
          <button
            onClick={handleAdd}
            className="
              px-4 py-2 rounded-lg
              bg-orange-400 hover:bg-orange-500
              text-black text-sm font-medium
            "
          >
            Comment
          </button>
        </div>
      ) : (
        <p className="text-sm text-neutral-500 mb-6">
          Login to add a comment
        </p>
      )}

      {/* List */}
      {loading ? (
        <p className="text-sm text-neutral-500">
          Loading comments…
        </p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No comments yet
        </p>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}
