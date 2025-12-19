"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePoster } from "@/hooks/usePoster";

import { slugify } from "@/lib/utils";
import placeholderImage from "@/assets/movieplaceholder.png";
import Image from "next/image";

/**
 * Card de película estilo Netflix premium
 * Con hover effect, metadata y animaciones suaves
 */
export const MovieCard = ({ movie }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { posterUrl, loadingPoster } = usePoster(movie.Title);

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
    <Link href={`/movies/${slugify(movie.Title)}`} passHref>
      <Card
        className="group relative overflow-hidden border border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer flex flex-col h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Poster Container */}
        <div className="relative aspect-[2/3] bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 overflow-hidden shrink-0">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.Title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            /* Placeholder Image */
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
              <Image
                src={placeholderImage}
                alt="Sin poster"
                className={`w-full h-full object-cover opacity-40 transition-opacity ${
                  loadingPoster ? "animate-pulse" : "opacity-40"
                }`}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <svg
                  className={`w-12 h-12 text-muted-foreground/40 mb-2 ${
                    loadingPoster ? "animate-pulse" : ""
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
                  {loadingPoster ? "Buscando..." : "Imagen no disponible"}
                </span>
              </div>
            </div>
          )}

          {/* Rating badge */}
          {movie.Rated && (
            <div className="absolute top-2 right-2 z-20">
              <Badge
                variant="secondary"
                className="bg-black/60 backdrop-blur-sm text-white border-white/20 text-[10px] px-1.5 py-0"
              >
                {movie.Rated}
              </Badge>
            </div>
          )}
        </div>

        {/* Content Section - Now below the image */}
        <div className="flex flex-col grow p-4 space-y-3">
          <div className="space-y-1">
            {/* Title */}
            <h3 className="text-base font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {movie.Title}
            </h3>

            {/* Year & Runtime */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{movie.Year}</span>
              <span className="opacity-50">•</span>
              <span>{formatRuntime(movie.Runtime)}</span>
            </div>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-1.5">
            {genres.map((genre, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-[10px] px-2 py-0 h-5 bg-secondary/50 text-secondary-foreground border-transparent"
              >
                {genre}
              </Badge>
            ))}
          </div>

          {/* Hover content - Director & Action (simplified) */}
          <div
            className={`transition-all duration-300 space-y-3 pt-1 ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-100 translate-y-0 md:opacity-0 md:translate-y-2 md:pointer-events-none"
            }`}
          >
            <p className="text-[11px] text-muted-foreground line-clamp-1">
              <span className="font-semibold">Dir:</span> {movie.Director}
            </p>
            <Button
              variant="default"
              size="sm"
              className="w-full text-xs h-8 bg-primary hover:bg-primary/90 text-white"
            >
              Ver detalles
            </Button>
          </div>
        </div>

        {/* Hover glow effect (subtle background) */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10">
          <div className="absolute inset-0 bg-primary/5" />
        </div>
      </Card>
    </Link>
  );
};
