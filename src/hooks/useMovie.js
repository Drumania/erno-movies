"use client";

import { useState, useEffect } from "react";
import { getAllMovies } from "@/services/movies.service";
import { slugify } from "@/lib/utils";

/**
 * Hook para obtener una película específica por título (vía slug)
 */
export const useMovie = (slug) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchMovie = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getAllMovies();

        if (response.error) {
          setError(response.error);
          setLoading(false);
          return;
        }

        // Buscamos la película comparando slugs
        const movieData = response.data?.find((m) => slugify(m.Title) === slug);

        if (movieData) {
          setMovie(movieData);
        } else {
          setError("Película no encontrada");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [slug]);

  return {
    movie,
    loading,
    error,
  };
};
