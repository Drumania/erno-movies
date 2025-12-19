"use client";

import { useState, useEffect } from "react";
import { getAllMovies } from "@/services/movies.service";

/**
 * Hook para obtener una película específica por título
 */
export const useMovie = (title) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!title) {
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

        const buscaTitulo = title.trim().toLowerCase();

        // Buscamos la película ignorando espacios y mayúsculas
        const movieData = response.data?.find(
          (m) => m.Title.trim().toLowerCase() === buscaTitulo
        );

        if (movieData) {
          setMovie(movieData);
        } else {
          console.group("Movie Not Found Debug");
          console.log("Input Title:", title);
          console.log("Sought (clean):", buscaTitulo);
          console.log(
            "Available Titles (first 5):",
            response.data?.slice(0, 5).map((m) => m.Title)
          );
          console.groupEnd();
          setError("Película no encontrada");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [title]);

  return {
    movie,
    loading,
    error,
  };
};
