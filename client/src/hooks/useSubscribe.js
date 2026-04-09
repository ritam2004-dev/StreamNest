import { useEffect, useState } from "react";
import { toggleSubscription } from "../api/subscription.api";

export default function useSubscribe({
  channelId,
  initialSubscribed = false,
  initialCount = 0,
}) {
  const [subscribed, setSubscribed] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // 🔥 SYNC WHEN CHANNEL DATA ARRIVES
  useEffect(() => {
    if (typeof initialSubscribed === "boolean") {
      setSubscribed(initialSubscribed);
    }
    if (typeof initialCount === "number") {
      setCount(initialCount);
    }
  }, [initialSubscribed, initialCount]);

  const toggle = async () => {
    if (!channelId || loading) return;

    const prevSubscribed = subscribed;
    const prevCount = count;

    setLoading(true);

    // optimistic update
    setSubscribed(!prevSubscribed);
    setCount(prevSubscribed ? prevCount - 1 : prevCount + 1);

    try {
      await toggleSubscription(channelId);
    } catch {
      // rollback
      setSubscribed(prevSubscribed);
      setCount(prevCount);
    } finally {
      setLoading(false);
    }
  };

  return { subscribed, count, toggle, loading };
}
