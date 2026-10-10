import { useCallback, useEffect, useState } from "react";
import api, { getErrorMessage } from "../api/axios";

export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await api.get(url);
      setData(res.data.data);
      setFetchedAt(Date.now());
      setError("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [url]);

   useEffect(() => {
    // setState happens only after the awaited request finishes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return { data, loading, error, reload: load, fetchedAt };
}