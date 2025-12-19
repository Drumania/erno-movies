import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

export function Filters({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  total,
  perPage,
  onPerPageChange,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  const removeFilter = (key) => {
    onFilterChange({ [key]: "" });
  };

  const getActiveLabel = (key) => {
    switch (key) {
      case "director":
        return `Director: ${filters.director}`;
      case "genre":
        return `Género: ${filters.genre}`;
      case "year":
        return `Año: ${filters.year}`;
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Top Bar: Title & Per Page Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-1 bg-primary rounded-full" />
          <h2 className="text-2xl font-bold tracking-tight">Catálogo</h2>
          {total > 0 && (
            <span className="text-sm font-medium text-muted-foreground ml-2 bg-secondary/50 px-2 py-0.5 rounded-full">
              {total} resultados
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Mostrar:
          </span>
          <div className="w-[110px]">
            <Select
              value={perPage?.toString() || "10"}
              onValueChange={(val) => onPerPageChange(val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 por página</SelectItem>
                <SelectItem value="10">10 por página</SelectItem>
                <SelectItem value="15">15 por página</SelectItem>
                <SelectItem value="all">Todas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Filter Inputs Panel */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-muted-foreground">
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
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span className="font-medium text-sm">Filtros de Búsqueda</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
              Director
            </label>
            <Input
              name="director"
              placeholder="Ej: Christopher Nolan"
              value={filters.director}
              onChange={handleChange}
              className="bg-background/50 border-input/50 focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
              Género
            </label>
            <Input
              name="genre"
              placeholder="Ej: Action, Drama"
              value={filters.genre}
              onChange={handleChange}
              className="bg-background/50 border-input/50 focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
              Año
            </label>
            <Input
              name="year"
              placeholder="Ej: 2023"
              value={filters.year}
              onChange={handleChange}
              className="bg-background/50 border-input/50 focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Active Filters Badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-border/50 animate-in fade-in slide-in-from-top-2">
            <span className="text-sm font-medium mr-2">Activos:</span>
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              return (
                <Badge
                  key={key}
                  variant="secondary"
                  className="pl-2 pr-1 py-1 flex items-center gap-1 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors cursor-pointer group"
                  onClick={() => removeFilter(key)}
                >
                  {getActiveLabel(key)}
                  <X className="h-3 w-3 text-muted-foreground group-hover:text-destructive ml-1" />
                </Badge>
              );
            })}

            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="ml-auto text-xs text-muted-foreground hover:text-primary"
            >
              Borrar todos
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
