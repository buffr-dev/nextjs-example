import { useEffect, useMemo, useState } from "react";

export function useImageDownloader(initialURL?: string | null) {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function downloadImage(url: string) {
      setLoading(true);
      try {
        const res = await fetch(url);
        setBlob(await res.blob());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (initialURL) {
      downloadImage(initialURL);
    } else {
      setBlob(null);
    }
  }, [initialURL]);

  const blobDataURL = useMemo(() => {
    if (!blob) return null;

    return URL.createObjectURL(blob);
  }, [blob]);

  return { blobDataURL, blob, loading };
}
