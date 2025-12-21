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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlayCircle, Clock } from "lucide-react";
import { IaChat } from "@/components/IaChat";
import placeholderImage from "@/assets/movieplaceholder.png";
import Image from "next/image";

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  // El parámetro ahora es un slug (ej: magic-in-the-moonlight)
  const movieSlug = params?.title || "";

  const { movie, allMovies, loading, error } = useMovie(movieSlug);
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

  // Pantallas de Carga y Error
  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-in fade-in duration-500">
        <div className="flex flex-col gap-10">
          <Skeleton className="h-8 w-48" /> {/* Back button skeleton */}
          <div className="grid md:grid-cols-[300px_1fr] gap-10 lg:gap-16 items-start">
            <Skeleton className="aspect-2/3 w-full rounded-xl" />{" "}
            {/* Poster skeleton */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Skeleton className="h-12 md:h-20 w-3/4" />{" "}
                {/* Title skeleton */}
                <div className="flex gap-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>

              <div className="space-y-3">
                <Skeleton className="h-6 w-32" /> {/* Synopsis title */}
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>

              <div className="bg-card/30 rounded-xl border border-border/50 p-6 md:p-8 space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error || !movie)
    return (
      <div className="p-12 text-center text-destructive">
        Película no encontrada.
      </div>
    );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-in fade-in duration-500">
      <div className="flex flex-col gap-10">
        {/* Navigation */}
        <div className="flex items-center justify-between pb-2">
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
            <span className="font-medium">Volver al catálogo</span>
          </Link>
        </div>

        <div className="grid md:grid-cols-[300px_1fr] gap-10 lg:gap-16 items-start">
          {/* Left Column: Poster & Actions */}
          <div className="space-y-6">
            <div className="aspect-2/3 rounded-xl overflow-hidden shadow-2xl bg-muted relative group ring-1 ring-white/10">
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={movie.Title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                  <Image
                    src={placeholderImage}
                    alt="Sin poster"
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                  />
                  <p className="relative z-10 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                    Imagen no disponible
                  </p>
                </div>
              )}
              <div className="absolute top-4 right-4">
                <Badge
                  variant="secondary"
                  className="text-lg px-3 py-1 bg-black/70 backdrop-blur text-white border-white/20"
                >
                  {movie.Rated || "NR"}
                </Badge>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="w-full cursor-pointer text-lg h-12 shadow-lg shadow-primary/20"
                  size="lg"
                >
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Ver Trailer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-black border-zinc-800 text-white">
                <DialogHeader className="p-4 bg-zinc-900 border-b border-zinc-800">
                  <DialogTitle className="text-xl font-bold text-white">
                    Trailer: {movie.Title}
                  </DialogTitle>
                </DialogHeader>
                <div className="aspect-video w-full">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Right Column: Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-4 leading-tight">
                {movie.Title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-muted-foreground text-sm sm:text-base mb-6">
                <Badge variant="outline" className="px-3 py-1 bg-secondary/30">
                  {movie.Year}
                </Badge>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {movie.Runtime || "N/A"}
                </span>
                <span>•</span>
                <span className="text-primary font-medium">{movie.Genre}</span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <h3 className="text-xl font-semibold mb-2">Sinopsis</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {movie.Plot ||
                  `Explora esta fascinante historia dirigida por ${movie.Director}. Una producción que combina el talento de ${movie.Actors} en una narrativa inolvidable del género ${movie.Genre}.`}
              </p>
            </div>

            <div className="bg-card/30 backdrop-blur rounded-xl border border-border/50 p-6 md:p-8 space-y-2">
              <InfoRow label="Director" value={movie.Director} />
              <InfoRow label="Escritores" value={movie.Writer} />
              <InfoRow label="Elenco Principal" value={movie.Actors} />
              <InfoRow label="Lanzamiento" value={movie.Released} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
