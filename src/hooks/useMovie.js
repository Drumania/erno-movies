"use client";

import { useState, useEffect } from "react";
import { getMovieByTitle, getMovies } from "@/services/movies.service";

/**
 * Hook para obtener una película específica por título
 * Intenta buscar en cache primero, luego en la API
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

      // Estrategia: buscar en todas las páginas hasta encontrar
      // En producción, habría un endpoint específico
      let found = false;
      let currentPage = 1;
      let totalPages = 1;

      while (!found && currentPage <= totalPages) {
        const response = await getMovies(currentPage);

        if (response.error) {
          setError(response.error);
          setLoading(false);
          return;
        }

        totalPages = response.data.total_pages;
        const movieData = response.data.data?.find(
          (m) =>
            m.Title.toLowerCase() === decodeURIComponent(title).toLowerCase()
        );

        if (movieData) {
          setMovie(movieData);
          found = true;
          setLoading(false);
          return;
        }

        currentPage++;
      }

      // No se encontró la película
      if (!found) {
        setError("Película no encontrada");
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
