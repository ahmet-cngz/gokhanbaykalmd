import { useCallback, useEffect, useState } from "react";

export default function useCopyLink(duration = 3500) {
  const [copied, setCopied] = useState(false);
  const [fallback, setFallback] = useState(false);

  const reset = useCallback(() => {
    setCopied(false);
    setFallback(false);
  }, []);

  const copyLink = useCallback(async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setFallback(false);
    } catch {
      setFallback(true);
    }
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), duration);
    return () => clearTimeout(timer);
  }, [copied, duration]);

  return { copied, fallback, copyLink, reset };
}
