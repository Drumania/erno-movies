"use client";

import { Button } from "@/components/ui/button";

/**
 * Componente de paginación premium estilo Netflix
 */
export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "mt-12 mb-8",
}) => {
  // Generar array de páginas a mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 7;

    if (totalPages <= maxPagesToShow) {
      // Mostrar todas las páginas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas con ellipsis
      if (currentPage <= 3) {
        // Inicio
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Final
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        // Medio
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Botón Previous */}
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </Button>

      {/* Números de página */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 text-muted-foreground"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <Button
              key={page}
              variant={isActive ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-primary/10"
              }`}
            >
              {page}
            </Button>
          );
        })}
      </div>

      {/* Botón Next */}
      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Button>

      {/* Info de página */}
      <div className="ml-4 text-sm text-muted-foreground hidden md:block">
        Página{" "}
        <span className="font-semibold text-foreground">{currentPage}</span> de{" "}
        <span className="font-semibold text-foreground">{totalPages}</span>
      </div>
    </div>
  );
};
