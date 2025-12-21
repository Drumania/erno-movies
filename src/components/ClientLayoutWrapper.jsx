"use client";

import { useState } from "react";
import { useMovies } from "@/hooks/useMovies";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { IaChat } from "@/components/IaChat";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ClientLayoutWrapper({ children }) {
  const { allMovies } = useMovies();
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background relative">
      {/* Left Section (100% on mobile, 75% on desktop) */}
      <div className="relative flex flex-col w-full lg:w-3/4 h-full border-r border-border/50 transition-all duration-300">
        {/* Header Fixed at top */}
        <div className="z-40 h-[80px] w-full border-b border-border/50 bg-background/95 backdrop-blur-md">
          <Header />
        </div>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto bg-background flex flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
        </main>
      </div>

      {/* Desktop Sidebar (Fixed 25%) */}
      <aside className="hidden lg:block lg:w-1/4 h-full bg-card/10 border-l border-border/50">
        <IaChat allMovies={allMovies} />
      </aside>

      {/* Mobile Chat Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-60 lg:hidden transition-all duration-300 transform",
          isMobileChatOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Background Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
            isMobileChatOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsMobileChatOpen(false)}
        />

        {/* Chat Drawer */}
        <div className="absolute right-0 top-0 h-full w-[85%] max-w-[400px] bg-background shadow-2xl flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-bold">Eron IA Movie</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileChatOpen(false)}
              className="cursor-pointer"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            <IaChat
              allMovies={allMovies}
              isMobile
              onClose={() => setIsMobileChatOpen(false)}
            />
          </div>
        </div>
      </div>

      {/* Floating Action Button (Mobile Only) */}
      <Button
        onClick={() => setIsMobileChatOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 lg:hidden z-50 rounded-full w-14 h-14 shadow-2xl shadow-primary/40 cursor-pointer transition-all hover:scale-110 active:scale-95",
          isMobileChatOpen && "scale-0 opacity-0"
        )}
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
}
