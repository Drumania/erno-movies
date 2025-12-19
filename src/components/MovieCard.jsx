"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * Card de película estilo Netflix premium
 * Con hover effect, metadata y animaciones suaves
 */
export const MovieCard = ({ movie }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Parsear géneros (vienen como string separado por comas)
  const genres =
    movie.Genre?.split(",")
      .map((g) => g.trim())
      .slice(0, 2) || [];

  // Calcular duración en formato legible
  const formatRuntime = (runtime) => {
    if (!runtime) return "N/A";
    const minutes = parseInt(runtime);
    if (isNaN(minutes)) return runtime;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <Link href={`/movies/${encodeURIComponent(movie.Title)}`} passHref>
      <Card
        className="group relative overflow-hidden border-0 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 z-10" />

        {/* Imagen placeholder con gradiente */}
        <div className="relative aspect-[2/3] bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20">
          {/* Icon de película */}
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <svg
              className="w-20 h-20 text-muted-foreground/20"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
          </div>

          {/* Rating badge */}
          {movie.Rated && (
            <div className="absolute top-3 right-3 z-20">
              <Badge
                variant="secondary"
                className="bg-black/60 backdrop-blur-sm text-white border-white/20"
              >
                {movie.Rated}
              </Badge>
            </div>
          )}
        </div>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20 transform transition-transform duration-300">
          {/* Title */}
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {movie.Title}
          </h3>

          {/* Year & Runtime */}
          <div className="flex items-center gap-2 mb-2 text-sm text-gray-300">
            <span>{movie.Year}</span>
            <span className="text-muted-foreground">•</span>
            <span>{formatRuntime(movie.Runtime)}</span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {genres.map((genre, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-white/10 backdrop-blur-sm text-white border-white/20 text-xs"
              >
                {genre}
              </Badge>
            ))}
          </div>

          {/* Hover content - Director */}
          <div
            className={`transition-all duration-300 ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <p className="text-xs text-gray-400 mb-2">
              <span className="font-semibold text-gray-300">Director:</span>{" "}
              {movie.Director}
            </p>
            <Button
              variant="default"
              size="sm"
              className="w-full group-hover:bg-primary"
            >
              Ver detalles
            </Button>
          </div>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0">
          <div className="absolute inset-0 bg-primary/5 blur-xl" />
        </div>
      </Card>
    </Link>
  );
};
