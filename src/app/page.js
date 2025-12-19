"use client";

import { useMovies } from "@/hooks/useMovies";
import { MovieGrid } from "@/components/MovieGrid";
import { Filters } from "@/components/Filters";
import { Pagination } from "@/components/Pagination";
import { ThemeToggle } from "@/components/ThemeToggle";

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
  } = useMovies();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95">
      {/* Header Hero Section */}
      <div className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="space-y-4">
            {/* Header Flex con Logo y ThemeToggle */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              {/* Logo/Brand */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <svg
                      className="w-7 h-7 text-primary-foreground"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent tracking-tight">
                    Eron Movies
                  </h1>
                </div>
                <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                  Descubre, explora y sumérgete en el mundo del cine.
                </p>
              </div>

              {/* Toggle a la derecha */}
              <div className="flex items-center gap-4">
                <ThemeToggle />
              </div>
            </div>
            {/* Stats removidas de aquí, se mueven a Filters */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        {/* Filtros */}
        <Filters
          filters={filters}
          onFilterChange={updateFilters}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          // Nuevos props para paginación y estadísticas
          total={total}
          perPage={perPage}
          onPerPageChange={changePerPage}
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
        {!loading && !error && !hasActiveFilters && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20 bg-card/30 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-foreground font-medium mb-1">
                © 2025 Eron Movies
              </p>
              <p className="text-xs text-muted-foreground">
                Challenge técnico desarrollado con pasión.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full">
              <span>Desarrollado con</span>
              <span className="text-primary animate-pulse">♥</span>
              <span>usando Next.js + Tailwind + shadcn/ui</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
