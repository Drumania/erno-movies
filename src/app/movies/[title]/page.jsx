"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useMovie } from "@/hooks/useMovie";
import { usePoster } from "@/hooks/usePoster";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import placeholderImage from "@/assets/movieplaceholder.png";
import Image from "next/image";

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  // El parámetro ahora es un slug (ej: magic-in-the-moonlight)
  const movieSlug = params?.title || "";

  const { movie, loading, error } = useMovie(movieSlug);
  const { posterUrl } = usePoster(movie?.Title || movieSlug);

  // Helper para formatear metadata
  const InfoRow = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3 border-b border-border/10 last:border-0">
      <span className="text-sm font-medium text-muted-foreground sm:w-32 shrink-0">
        {label}
      </span>
      <span className="text-base text-foreground font-medium">
        {value || "N/A"}
      </span>
    </div>
  );

  // Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <Skeleton className="h-10 w-32" /> {/* Back button */}
          <div className="grid md:grid-cols-[300px_1fr] gap-8 md:gap-12">
            <Skeleton className="h-[450px] w-full rounded-xl" />{" "}
            {/* Poster placeholder */}
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" /> {/* Title */}
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-40 w-full" /> {/* Synopsis placeholder */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6 bg-card/50 backdrop-blur">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto text-destructive">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Película no encontrada</h2>
          <p className="text-muted-foreground">
            No pudimos encontrar la película que buscas. Podría haber sido
            eliminada o el enlace es incorrecto.
          </p>
          <Button
            onClick={() => router.push("/")}
            variant="default"
            className="w-full"
          >
            Volver al inicio
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Background Ambient Effect */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vh] bg-primary/20 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vh] bg-blue-500/10 blur-[100px] rounded-full opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Navigation */}
        <div className="mb-0 flex items-center mb-4 justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center mr-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </div>
            <span className="font-medium ">Volver al catálogo</span>
          </Link>
        </div>
        <div className="grid lg:grid-cols-[350px_1fr] gap-10 lg:gap-16 items-start">
          {/* Left Column: Poster & Actions */}
          <div className="space-y-6">
            <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl bg-muted relative group ring-1 ring-white/10">
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={movie.Title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 overflow-hidden">
                  <Image
                    src={placeholderImage}
                    alt="Sin poster"
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                  />
                  <div className="relative z-10 flex flex-col items-center justify-center text-center p-6">
                    <svg
                      className="w-20 h-20 text-muted-foreground/40 mb-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                    <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
                      Imagen no disponible
                    </p>
                  </div>
                </div>
              )}

              {/* Overlay with rating */}
              <div className="absolute top-4 right-4">
                <Badge
                  variant="secondary"
                  className="text-lg px-3 py-1 bg-black/70 backdrop-blur text-white border-white/20"
                >
                  {movie.Rated || "NR"}
                </Badge>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                className="w-full cursor-pointer text-lg h-12 shadow-lg shadow-primary/20"
                size="lg"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Ver Trailer
              </Button>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            {/* Header Info */}
            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-4 leading-tight">
                {movie.Title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-muted-foreground text-sm sm:text-base mb-6">
                <span className="px-3 py-1 rounded-md bg-secondary/50 font-medium text-foreground border border-border/50">
                  {movie.Year}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {movie.Runtime || "N/A"}
                </span>
                <span>•</span>
                <span className="text-primary font-medium">{movie.Genre}</span>
              </div>
            </div>

            {/* Synopsis (Fake generated since API doesn't provide it in the mock list sometimes) */}
            <div className="prose prose-invert max-w-none">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                Sinopsis
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {movie.Plot ||
                  "Explora esta fascinante historia dirigida por " +
                    movie.Director +
                    ". Una producción que combina el talento de " +
                    movie.Actors +
                    " en una narrativa inolvidable del género " +
                    movie.Genre +
                    "."}
              </p>
            </div>

            {/* Cast & Crew Grid */}
            <div className="bg-card/30 backdrop-blur rounded-xl border border-border/50 p-6 md:p-8 space-y-2">
              <InfoRow label="Director" value={movie.Director} />
              <InfoRow label="Escritores" value={movie.Writer} />
              <InfoRow label="Elenco Principal" value={movie.Actors} />
              <InfoRow label="Lanzamiento" value={movie.Released} />
            </div>

            {/* Tags/Categories */}
            <div className="pt-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                Etiquetas
              </h4>
              <div className="flex flex-wrap gap-2">
                {movie.Genre?.split(",").map((g, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="text-sm py-1 px-3 hover:bg-primary/10 transition-colors cursor-default"
                  >
                    {g.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
