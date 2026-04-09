import { useEffect, useState } from "react";
import {
  toggleVideoLike,
  toggleCommentLike,
} from "../api/like.api";

export default function useLike({
  type, // "video" | "comment"
  id,
  initialLiked = false,
  initialCount = 0,
}) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // 🔥 SYNC STATE WHEN BACKEND DATA ARRIVES
  useEffect(() => {
    if (typeof initialLiked === "boolean") {
      setLiked(initialLiked);
    }
    if (typeof initialCount === "number") {
      setCount(initialCount);
    }
  }, [initialLiked, initialCount]);

  const toggle = async () => {
    if (!id || loading) return;

    const prevLiked = liked;
    const prevCount = count;

    setLoading(true);

    // optimistic update
    setLiked(!prevLiked);
    setCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      if (type === "video") {
        await toggleVideoLike(id);
      } else {
        await toggleCommentLike(id);
      }
    } catch {
      // rollback
      setLiked(prevLiked);
      setCount(prevCount);
    } finally {
      setLoading(false);
    }
  };

  return { liked, count, toggle, loading };
}
