"use client";

import { useState, useEffect, useCallback } from "react";
import { getMovies } from "@/services/movies.service";

/**
 * Hook para manejar la lista de películas con paginación y filtros
 */
export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]); // Para filtros
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  // Filtros
  const [filters, setFilters] = useState({
    director: "",
    genre: "",
    year: "",
  });

  // Fetch películas por página
  const fetchMovies = useCallback(
    async (pageNumber, limit = perPage) => {
      setLoading(true);
      setError(null);

      const response = await getMovies(pageNumber, limit);

      if (response.error) {
        setError(response.error);
        setLoading(false);
        return;
      }

      const {
        data,
        page: currentPage,
        per_page,
        total,
        total_pages,
      } = response.data;

      setMovies(data || []);
      setPage(currentPage);
      // Si la API devuelve el per_page usado, lo usamos para confirmar,
      // pero mantenemos el estado local si es 'all' o custom
      if (typeof limit === "number") {
        setPerPage(per_page);
      }
      setTotal(total);
      setTotalPages(total_pages);
      setLoading(false);

      if (pageNumber === 1 && allMovies.length === 0) {
        setAllMovies(data || []);
      }
    },
    [allMovies.length, perPage]
  );

  // Aplicar filtros
  const applyFilters = useCallback(() => {
    let result = [...movies];

    if (filters.director) {
      result = result.filter((movie) =>
        movie.Director?.toLowerCase().includes(filters.director.toLowerCase())
      );
    }

    if (filters.genre) {
      result = result.filter((movie) =>
        movie.Genre?.toLowerCase().includes(filters.genre.toLowerCase())
      );
    }

    if (filters.year) {
      result = result.filter((movie) => movie.Year === filters.year);
    }

    setFilteredMovies(result);
  }, [movies, filters]);

  // Cargar primera página al montar
  useEffect(() => {
    // Al montar usamos el default 10
    fetchMovies(1, 10);
  }, []); // Empty dependency array to run only once on mount

  // Aplicar filtros cuando cambien
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Cambiar de página
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      fetchMovies(pageNumber, perPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /**
   * Cambiar cantidad de elementos por página
   * @param {string|number} newPerPage - Nuevo valor (4, 8, 12, 'all')
   */
  const changePerPage = (newPerPage) => {
    let limit = newPerPage;
    if (newPerPage !== "all") {
      limit = parseInt(newPerPage, 10);
    }
    setPerPage(limit);
    fetchMovies(1, limit);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Actualizar filtros
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      director: "",
      genre: "",
      year: "",
    });
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = filters.director || filters.genre || filters.year;

  return {
    movies: hasActiveFilters ? filteredMovies : movies,
    loading,
    error,
    page,
    totalPages,
    perPage,
    total,
    filters,
    hasActiveFilters,
    goToPage,
    changePerPage, // Nueva función expuesta
    updateFilters,
    clearFilters,
    refetch: () => fetchMovies(page, perPage),
  };
};
