import { useEffect, useState } from "react";

export default function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);

    // Cleanup: runs when the component goes away
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}