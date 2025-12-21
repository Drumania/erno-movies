import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sparkles,
  Send,
  Loader2,
  PlayCircle,
  Clock,
  Calendar,
  Tag,
  Trash2,
} from "lucide-react";
import { cn, slugify } from "@/lib/utils";

/**
 * Componente principal del Asistente IA para Recomendaciones
 */
export const IaChat = ({ allMovies = [], isMobile = false, onClose }) => {
  const [input, setInput] = useState("");
  const [isLoding, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [intent, setIntent] = useState(null);
  const scrollRef = useRef(null);

  // Mensaje inicial
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content:
          "¡Hola! ¿Cómo estás hoy? ¿Qué tenés ganas de ver? Decime qué te gusta, qué no, o cómo te sentís.",
      },
    ]);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer =
        scrollRef.current.querySelector("[data-radix-scroll-area-viewport]") ||
        scrollRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages, isLoding, recommendations]);

  /**
   * Simulación de llamada a IA para extraer intención
   * En un escenario real, esto llamaría a una API de OpenAI/Groq
   */
  const extractIntent = async (text) => {
    // Simulamos latencia
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const lowerText = text.toLowerCase();

    // Lógica determinística simple que simula el procesamiento de lenguaje natural
    // En un challenge real, aquí conectaríamos con un endpoint de Next.js que use GPT-4o-mini
    const mockIntent = {
      mood: lowerText.includes("triste")
        ? "animado"
        : lowerText.includes("acción")
        ? "adrenalinico"
        : "relajado",
      preferredGenres: [],
      excludedGenres: [],
      maxRuntime: 0,
      yearRange: null,
      directorLike: null,
    };

    // Extraer géneros
    const genresMap = {
      romántico: "Romance",
      romantica: "Romance",
      romance: "Romance",
      amor: "Romance",
      acción: "Action",
      accion: "Action",
      comedia: "Comedy",
      risa: "Comedy",
      terror: "Horror",
      miedo: "Horror",
      drama: "Drama",
      "ciencia ficción": "Sci-Fi",
      "ciencia ficcion": "Sci-Fi",
      suspenso: "Thriller",
      thriller: "Thriller",
    };

    Object.keys(genresMap).forEach((key) => {
      if (lowerText.includes(key)) {
        mockIntent.preferredGenres.push(genresMap[key]);
      }
    });

    // Extraer directores específicos
    if (lowerText.includes("tarantino"))
      mockIntent.directorLike = "Quentin Tarantino";
    if (lowerText.includes("nolan"))
      mockIntent.directorLike = "Christopher Nolan";
    if (lowerText.includes("woody") || lowerText.includes("allen"))
      mockIntent.directorLike = "Woody Allen";

    if (
      lowerText.includes("corta") ||
      lowerText.includes("corto") ||
      lowerText.includes("rápido") ||
      lowerText.includes("poco tiempo")
    )
      mockIntent.maxRuntime = 100;

    if (
      lowerText.includes("larga") ||
      lowerText.includes("largo") ||
      lowerText.includes("épica") ||
      lowerText.includes("mucho tiempo")
    )
      mockIntent.maxRuntime = 200;

    if (
      lowerText.includes("nueva") ||
      lowerText.includes("nuevo") ||
      lowerText.includes("reciente") ||
      lowerText.includes("estreno") ||
      lowerText.includes("últimos años")
    )
      mockIntent.yearRange = [2013, 2025];

    if (
      lowerText.includes("vieja") ||
      lowerText.includes("algo viejo") ||
      lowerText.includes("algo vieja") ||
      lowerText.includes("clásica") ||
      lowerText.includes("antigua")
    )
      mockIntent.yearRange = [1900, 2005];

    return mockIntent;
  };

  /**
   * Lógica de recomendación Determinística
   */
  const getRecommendations = (movies, intent) => {
    if (!movies.length) return [];

    let scored = movies.map((m) => {
      let score = 0;
      let matches = [];

      // Scoring por género
      if (intent.preferredGenres.length > 0) {
        const movieGenres = m.Genre?.split(",").map((g) => g.trim()) || [];
        const matchCount = movieGenres.filter((g) =>
          intent.preferredGenres.includes(g)
        ).length;
        score += matchCount * 10;
        if (matchCount > 0)
          matches.push(
            ...movieGenres.filter((g) => intent.preferredGenres.includes(g))
          );
      }

      // Scoring por duración
      if (intent.maxRuntime > 0) {
        const runtime = parseInt(m.Runtime) || 0;
        if (runtime > 0 && runtime <= intent.maxRuntime) {
          score += 5;
          matches.push(`${runtime} min`);
        }
      }

      // Scoring por año
      if (intent.yearRange) {
        const year = parseInt(m.Year) || 0;
        if (year >= intent.yearRange[0] && year <= intent.yearRange[1]) {
          score += 5;
          matches.push(m.Year);
        }
      }

      // Scoring por director
      if (intent.directorLike) {
        if (
          m.Director?.toLowerCase().includes(intent.directorLike.toLowerCase())
        ) {
          score += 20;
          matches.push(`Director: ${intent.directorLike}`);
        }
      }

      // Bonus por mood (ejemplo simple)
      if (intent.mood === "animado" && m.Genre?.includes("Comedy")) score += 5;

      return { ...m, score, matches: [...new Set(matches)] };
    });

    // Ordenar por score y devolver top 3
    return scored
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "¡Hola! ¿Cómo estás hoy? ¿Qué tenés ganas de ver? Decime qué te gusta, qué no, o cómo te sentís.",
      },
    ]);
    setRecommendations([]);
    setIntent(null);
    setInput("");
  };

  const handleRecommend = async () => {
    if (!input.trim()) return;

    const userQuery = input.trim();
    setInput(""); // Borramos el input inmediatamente
    setMessages((prev) => [...prev, { role: "user", content: userQuery }]);
    setIsLoading(true);
    setRecommendations([]);

    try {
      // 1. Interpretar intención
      const extractedIntent = await extractIntent(userQuery);
      setIntent(extractedIntent);

      // 2. Filtrar películas
      const results = getRecommendations(allMovies, extractedIntent);

      // 3. Generar mensaje de respuesta
      let msg = "";
      if (results.length > 0) {
        msg = `¡Claro! Basado en lo que buscas, estas son las mejores opciones que encontré para vos:`;
        setRecommendations(results);
      } else {
        msg = `No logré encontrar una coincidencia exacta con esos criterios por ahora, pero seleccioné estas recomendaciones que seguro vas a disfrutar:`;
        setRecommendations(allMovies.slice(0, 3));
      }

      setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Ups, tuve un problema procesando tu pedido. ¿Podrías intentar de nuevo?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className={cn(
        "flex flex-col h-full shadow-2xl rounded-none border-y-0 border-r-0 border-l",
        isMobile
          ? "border-none shadow-none bg-transparent"
          : "bg-card/80 backdrop-blur-md"
      )}
    >
      {!isMobile && (
        <CardHeader className="pb-3 text-center">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            Eron IA Movie
          </CardTitle>
        </CardHeader>
      )}

      <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
        <ScrollArea className="flex-1 px-4" ref={scrollRef}>
          <div className="space-y-4 py-6">
            {/* Historial de Mensajes */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  "flex flex-col max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                  msg.role === "user"
                    ? "ml-auto items-end"
                    : "mr-auto items-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none shadow-md"
                      : "bg-muted/50 text-foreground border border-border/50 rounded-tl-none"
                  )}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 px-1">
                  {msg.role === "user" ? "Tú" : "Eron-Bot"}
                </span>
              </div>
            ))}

            {/* Recomendaciones (si es el último mensaje del asistente) */}
            {recommendations.length > 0 && (
              <div className="space-y-3 pt-2 animate-in fade-in zoom-in-95 duration-500">
                {recommendations.map((movie, index) => (
                  <Link
                    key={`${movie.Title}-${movie.Year}-${index}`}
                    href={`/movies/${slugify(movie.Title)}`}
                    onClick={() => isMobile && onClose?.()}
                    className="block group bg-background border border-border/50 rounded-xl p-3 hover:border-primary/50 transition-all duration-300 hover:shadow-md cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1">
                        {movie.Title}
                      </h4>
                      <Badge
                        variant="outline"
                        className="text-[10px] h-5 px-1.5 opacity-70"
                      >
                        {movie.Year}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {movie.matches?.slice(0, 3).map((match, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-[9px] h-4 px-1 font-normal bg-primary/10 text-primary border-none"
                        >
                          {match}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3" /> {movie.Runtime}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Tag className="w-3 h-3" />{" "}
                          {movie.Genre?.split(",")[0]}
                        </span>
                      </div>
                      <PlayCircle className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {isLoding && (
              <div className="flex items-center gap-2 text-muted-foreground text-xs animate-pulse p-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                Analizando tu pedido...
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-4 border-t bg-muted/20 flex flex-col gap-3">
        {/* Sugerencias rápidas */}
        <div className="flex flex-wrap gap-2 mb-1">
          {[
            "Quiero ver algo romántico",
            "Algo nuevo",
            "Una peli de Tarantino",
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                setInput(suggestion);
                // Opcional: handleRecommend() directo si queremos que sea instantaneo
              }}
              className="text-[10px] px-2 py-1 rounded-full bg-background border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary cursor-pointer"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <div className="relative w-full">
          <Textarea
            placeholder="Ej: Quiero ver algo de acción que sea corto y de este año..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[80px] pr-20 pb-8 resize-none bg-background/50 border-muted-foreground/20 focus-visible:ring-primary/30 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleRecommend();
              }
            }}
          />
          <div className="absolute bottom-2 right-2 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg border-muted-foreground/20 hover:bg-destructive/10 hover:text-destructive transition-colors"
              onClick={handleClearChat}
              title="Limpiar chat"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              className={cn(
                "h-8 rounded-lg shadow-lg transition-transform hover:scale-105 active:scale-95 text-xs font-semibold gap-1",
                isMobile ? "w-8 p-0" : "px-3"
              )}
              onClick={handleRecommend}
              disabled={isLoding || !input.trim()}
              size={isMobile ? "icon" : "default"}
            >
              {isLoding ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <>
                  <Send className="w-3 h-3" />
                  {!isMobile && "Recomendar"}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
