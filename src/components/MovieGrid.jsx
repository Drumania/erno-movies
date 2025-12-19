"use client";

import { MovieCard } from "./MovieCard";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Grid responsivo de películas con skeleton loaders
 */
export const MovieGrid = ({ movies, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <svg
          className="w-24 h-24 text-muted-foreground/50 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No se encontraron películas
        </h3>
        <p className="text-muted-foreground text-center max-w-md">
          Intenta ajustar tus filtros o vuelve a intentarlo más tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-in fade-in duration-500">
      {movies.map((movie, index) => (
        <div
          key={`${movie.Title}-${index}`}
          className="animate-in fade-in slide-in-from-bottom-4"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  );
};
