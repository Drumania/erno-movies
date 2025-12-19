"use client";

import { useMovies } from "@/hooks/useMovies";
import { MovieGrid } from "@/components/MovieGrid";
import { Filters } from "@/components/Filters";
import { Pagination } from "@/components/Pagination";

export default function Home() {
  const {
    movies,
    loading,
    error,
    page,
    totalPages,
    total,
    perPage,
    filters,
    hasActiveFilters,
    goToPage,
    changePerPage,
    updateFilters,
    clearFilters,
    filterOptions,
  } = useMovies();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95 pt-8">
      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-20">
        {/* Filtros */}
        <Filters
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={updateFilters}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          total={total}
        />

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Error al cargar películas
            </h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              {error}
            </p>
          </div>
        )}

        {/* Movies Grid */}
        {!error && <MovieGrid movies={movies} loading={loading} />}

        {/* Paginación */}
        {!loading && !error && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        )}
      </div>
    </div>
  );
}
