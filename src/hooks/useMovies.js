"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getMovies } from "@/services/movies.service";

/**
 * Hook para manejar la lista de películas con paginación y filtros complejos del lado del cliente
 */
export const useMovies = () => {
  // Datos crudos
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de paginación
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Estados de filtros
  const [filters, setFilters] = useState({
    search: "", // Title search
    year: "all",
    rated: "all",
    director: "all",
    writer: "all",
    actors: "all",
    genre: "all",
    sort: "", // "released_desc"
  });

  // Opciones generadas dinámicamente
  const [filterOptions, setFilterOptions] = useState({
    years: [],
    rated: [],
    directors: [],
    writers: [],
    actors: [],
    genres: [],
  });

  // 1. Fetch de TODAS las películas (navegando las páginas)
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      // Pedimos la primera página para saber cuántas son
      const firstPage = await getMovies(1, 10);
      if (firstPage.error) throw new Error(firstPage.error);

      let moviesAccumulator = [...(firstPage.data.data || [])];
      const totalPages = firstPage.data.total_pages;

      // Si hay más páginas, las pedimos en paralelo o secuencia
      if (totalPages > 1) {
        const promises = [];
        for (let i = 2; i <= totalPages; i++) {
          promises.push(getMovies(i, 10));
        }

        const results = await Promise.all(promises);
        results.forEach((res) => {
          if (res.data?.data) {
            moviesAccumulator = [...moviesAccumulator, ...res.data.data];
          }
        });
      }

      // Deduplicar por Título y Año (evitar warnings de keys duplicadas y mejorar data)
      const uniqueMovies = Array.from(
        new Map(
          moviesAccumulator.map((m) => [`${m.Title}-${m.Year}`, m])
        ).values()
      );

      setAllMovies(uniqueMovies);
      extractFilterOptions(uniqueMovies);
    } catch (err) {
      setError(err.message || "Error cargando películas");
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Extraer opciones únicas para los selects
  const extractFilterOptions = (movies) => {
    const years = new Set();
    const rated = new Set();
    const directors = new Set();
    const writers = new Set();
    const actors = new Set();
    const genres = new Set();

    movies.forEach((m) => {
      if (m.Year) years.add(m.Year);
      if (m.Rated) rated.add(m.Rated);

      if (m.Director) {
        m.Director.split(",").forEach((d) => directors.add(d.trim()));
      }
      if (m.Writer) {
        m.Writer.split(",").forEach((w) => writers.add(w.trim()));
      }
      if (m.Actors) {
        m.Actors.split(",").forEach((a) => actors.add(a.trim()));
      }
      if (m.Genre) {
        m.Genre.split(",").forEach((g) => genres.add(g.trim()));
      }
    });

    setFilterOptions({
      years: Array.from(years).sort().reverse(),
      rated: Array.from(rated).sort(),
      directors: Array.from(directors).sort(),
      writers: Array.from(writers).sort(),
      actors: Array.from(actors).sort(),
      genres: Array.from(genres).sort(),
    });
  };

  // 3. Filtrar y ordenar (useMemo para optimizar)
  const processedMovies = useMemo(() => {
    let result = [...allMovies];

    // -- Filtros --

    // Search (Title)
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((m) => m.Title?.toLowerCase().includes(q));
    }

    // Single Selects
    if (filters.year && filters.year !== "all") {
      result = result.filter((m) => m.Year === filters.year);
    }
    if (filters.rated && filters.rated !== "all") {
      result = result.filter((m) => m.Rated === filters.rated);
    }
    if (filters.genre && filters.genre !== "all") {
      result = result.filter((m) => m.Genre?.includes(filters.genre));
    }

    // Multi-value checks (contains)
    if (filters.director && filters.director !== "all") {
      result = result.filter((m) => m.Director?.includes(filters.director));
    }
    if (filters.writer && filters.writer !== "all") {
      result = result.filter((m) => m.Writer?.includes(filters.writer));
    }
    if (filters.actors && filters.actors !== "all") {
      result = result.filter((m) => m.Actors?.includes(filters.actors));
    }

    // -- Ordenamiento --
    if (filters.sort === "released_desc") {
      result.sort((a, b) => {
        const dateA = new Date(a.Released).getTime();
        const dateB = new Date(b.Released).getTime();
        if (isNaN(dateA)) return 1;
        if (isNaN(dateB)) return -1;
        return dateB - dateA;
      });
    } else if (filters.sort === "released_asc") {
      result.sort((a, b) => {
        const dateA = new Date(a.Released).getTime();
        const dateB = new Date(b.Released).getTime();
        if (isNaN(dateA)) return 1;
        if (isNaN(dateB)) return -1;
        return dateA - dateB;
      });
    }

    return result;
  }, [allMovies, filters]);

  // 4. Paginación del lado del cliente
  const paginatedMovies = useMemo(() => {
    const start = (page - 1) * perPage;
    return processedMovies.slice(start, start + perPage);
  }, [processedMovies, page, perPage]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [filters, perPage]);

  // Initial fetch
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Handlers
  const updatedGoToPage = (newPage) => {
    const totalP = Math.ceil(processedMovies.length / perPage);
    if (newPage >= 1 && newPage <= totalP) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const changePerPage = (val) => {
    setPerPage(val === "all" ? processedMovies.length : Number(val));
  };

  const updateFilter = (key, val) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      year: "all",
      rated: "all",
      director: "all",
      writer: "all",
      actors: "all",
      genre: "all",
      sort: "",
    });
  };

  const hasActiveFilters =
    filters.search !== "" ||
    filters.year !== "all" ||
    filters.rated !== "all" ||
    filters.director !== "all" ||
    filters.writer !== "all" ||
    filters.actors !== "all" ||
    filters.genre !== "all" ||
    filters.sort !== "";

  return {
    movies: paginatedMovies, // Mostramos la pagina actual
    allMovies: allMovies, // DATA COMPLETA para el Asistente IA
    allFilteredCount: processedMovies.length, // Total real para mostrar "X resultados"
    loading,
    error,

    // Pagination props
    page,
    totalPages: Math.ceil(processedMovies.length / perPage) || 1,
    perPage,
    total: processedMovies.length,

    // Filters props
    filters,
    filterOptions,
    hasActiveFilters,

    // Actions
    goToPage: updatedGoToPage,
    changePerPage,
    updateFilters: updateFilter, // Cambio de firma: recibe (key, val) o objeto? Mejor estandarizar
    setFiltersRaw: setFilters, // Backdoor si hace falta
    clearFilters,
  };
};
