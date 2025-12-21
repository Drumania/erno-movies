"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logoEm from "@/assets/logo-em.png";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Shuffle, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getAllMovies } from "@/services/movies.service";
import { slugify } from "@/lib/utils";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isRandomLoading, setIsRandomLoading] = useState(false);
  const router = useRouter();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = (theme === "system" ? resolvedTheme : theme) === "dark";

  const toggleTheme = (checked) => {
    setTheme(checked ? "dark" : "light");
  };

  const handleRandom = async () => {
    setIsRandomLoading(true);
    try {
      const response = await getAllMovies();
      if (response.data && response.data.length > 0) {
        const randomIndex = Math.floor(Math.random() * response.data.length);
        const randomMovie = response.data[randomIndex];
        router.push(`/movies/${slugify(randomMovie.Title)}`);
      }
    } catch (error) {
      console.error("Error fetching random movie:", error);
    } finally {
      // Small timeout to ensure the transition feels smooth if navigation is instant
      setTimeout(() => setIsRandomLoading(false), 500);
    }
  };

  const LogoSection = () => (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-lg shadow-black/20 dark:shadow-white/10 group-hover:scale-105 transition-transform">
        <Image
          src={logoEm}
          alt="Eron Movies Logo"
          fill
          className="object-cover"
          priority
        />
      </div>
      <h1 className="text-2xl font-bold text-foreground tracking-tight pt-2 hidden md:block">
        Eron Movies{" "}
        <small className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
          by Martin Brumana
        </small>
      </h1>
    </Link>
  );

  if (!mounted) {
    return (
      <header className="h-[80px] bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 w-full z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
          <div className="h-6 w-32 bg-muted animate-pulse rounded hidden md:block" />
        </div>
      </header>
    );
  }

  return (
    <header
      className={`h-[80px] border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 w-full z-50 transition-colors duration-300 ${
        isDark ? "bg-black" : "bg-white"
      }`}
    >
      <LogoSection />

      {/* Random Button in the center */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <Button
          onClick={handleRandom}
          variant="default"
          className="rounded-full cursor-pointer gap-2 shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all text-white hidden md:flex min-w-[180px]"
          disabled={isRandomLoading}
        >
          {isRandomLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Shuffle className="h-4 w-4" />
          )}
          <span>{isRandomLoading ? "Buscando..." : "Película Aleatoria"}</span>
        </Button>
        {/* Mobile version */}
        <Button
          onClick={handleRandom}
          variant="default"
          size="icon"
          className="rounded-full shadow-lg shadow-primary/25 text-white md:hidden"
          disabled={isRandomLoading}
        >
          {isRandomLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Shuffle className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Sun
          className={`h-5 w-5 transition-colors ${
            !isDark ? "text-yellow-400" : "text-zinc-600"
          }`}
        />
        <Switch
          checked={isDark}
          onCheckedChange={toggleTheme}
          aria-label="Toggle theme"
          className="data-[state=checked]:bg-primary"
        />
        <Moon
          className={`h-5 w-5 transition-colors ${
            isDark ? "text-blue-400" : "text-zinc-600"
          }`}
        />
      </div>
    </header>
  );
}
