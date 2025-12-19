"use client";

import { useState, useEffect } from "react";
import { getPosterByTitle } from "@/services/poster.service";

/**
 * Hook para obtener el poster de una película con manejo de estados
 */
export const usePoster = (title) => {
  const [posterUrl, setPosterUrl] = useState(null);
  const [loadingPoster, setLoadingPoster] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!title) return;

    const fetchPoster = async () => {
      setLoadingPoster(true);
      const url = await getPosterByTitle(title);
      if (isMounted) {
        setPosterUrl(url);
        setLoadingPoster(false);
      }
    };

    fetchPoster();

    return () => {
      isMounted = false;
    };
  }, [title]);

  return { posterUrl, loadingPoster };
};
