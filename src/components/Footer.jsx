export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-20 bg-card/30 backdrop-blur-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm text-foreground font-medium mb-1">
              © 2025 Eron Movies
            </p>
            <p className="text-xs text-muted-foreground">
              By Martin Brumana
              <a
                href="https://github.com/drumania"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline px-2"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/martinbrumana"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                LinkedIn
              </a>
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
  );
}
