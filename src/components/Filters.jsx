import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  X,
  Search,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";
import { Pagination } from "@/components/Pagination";
import { useState } from "react";

export function Filters({
  filters,
  filterOptions,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  total,
  perPage,
  onPerPageChange,
  currentPage,
  totalPages,
  onPageChange,
  loading,
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleTextChange = (e) => {
    onFilterChange("search", e.target.value);
  };

  const handleSelectChange = (key, value) => {
    onFilterChange(key, value);
  };

  return (
    <div className="space-y-4 mb-8 w-full">
      {/* Mobile Toggle Button */}
      <div className="flex sm:hidden items-center justify-between mb-2">
        <Button
          variant="outline"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex items-center gap-2 border-primary/20 bg-card/50"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filtros</span>
          {hasActiveFilters && (
            <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-white text-[10px]">
              !
            </Badge>
          )}
          {isMobileOpen ? (
            <ChevronUp className="h-4 w-4 ml-1" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-1" />
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            Limpiar
          </Button>
        )}
      </div>

      {/* Filters Bar */}
      <div
        className={`bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 shadow-sm transition-all duration-300 ${
          isMobileOpen ? "block" : "hidden sm:block"
        }`}
      >
        <div className="flex flex-wrap items-end gap-3">
          {/* Search */}
          <div className="flex flex-col gap-1.5">
            <label
              className={`text-xs ml-1 transition-colors ${
                filters.search
                  ? "font-bold text-foreground"
                  : "font-medium text-muted-foreground"
              }`}
            >
              Búsqueda
            </label>
            <div className="relative w-full sm:w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título..."
                value={filters.search}
                onChange={handleTextChange}
                className={`pl-9 transition-colors ${
                  filters.search ? "border-foreground/40 ring-1 ring-black" : ""
                }`}
              />
            </div>
          </div>

          {/* Year */}
          <div className="flex flex-col gap-1.5">
            <label
              className={`text-xs ml-1 transition-colors ${
                filters.year && filters.year !== "all"
                  ? "font-bold text-foreground"
                  : "font-medium text-muted-foreground"
              }`}
            >
              Año
            </label>
            <Select
              value={filters.year}
              onValueChange={(val) => handleSelectChange("year", val)}
            >
              <SelectTrigger
                className={`w-[120px] transition-colors ${
                  filters.year && filters.year !== "all"
                    ? "border-foreground/40 ring-1 ring-black"
                    : ""
                }`}
              >
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {filterOptions.years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rated */}
          <div className="flex flex-col gap-1.5">
            <label
              className={`text-xs ml-1 transition-colors ${
                filters.rated && filters.rated !== "all"
                  ? "font-bold text-foreground"
                  : "font-medium text-muted-foreground"
              }`}
            >
              Clasificación
            </label>
            <Select
              value={filters.rated}
              onValueChange={(val) => handleSelectChange("rated", val)}
            >
              <SelectTrigger
                className={`w-[120px] transition-colors ${
                  filters.rated && filters.rated !== "all"
                    ? "border-foreground/40 ring-1 ring-black"
                    : ""
                }`}
              >
                <SelectValue placeholder="Rated" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {filterOptions.rated.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort: Released */}
          <div className="flex flex-col gap-1.5">
            <label
              className={`text-xs ml-1 transition-colors ${
                filters.sort && filters.sort !== "default"
                  ? "font-bold text-foreground"
                  : "font-medium text-muted-foreground"
              }`}
            >
              Orden
            </label>
            <Select
              value={filters.sort}
              onValueChange={(val) => handleSelectChange("sort", val)}
            >
              <SelectTrigger
                className={`w-[180px] transition-colors ${
                  filters.sort && filters.sort !== "default"
                    ? "border-foreground/40 ring-1 ring-black"
                    : ""
                }`}
              >
                <SelectValue placeholder="Orden" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Por defecto</SelectItem>
                <SelectItem value="released_desc">Más nuevas</SelectItem>
                <SelectItem value="released_asc">Más antiguas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Director */}
          <div className="flex flex-col gap-1.5">
            <label
              className={`text-xs ml-1 transition-colors ${
                filters.director && filters.director !== "all"
                  ? "font-bold text-foreground"
                  : "font-medium text-muted-foreground"
              }`}
            >
              Director
            </label>
            <Select
              value={filters.director}
              onValueChange={(val) => handleSelectChange("director", val)}
            >
              <SelectTrigger
                className={`w-[160px] transition-colors ${
                  filters.director && filters.director !== "all"
                    ? "border-foreground/40 ring-1 ring-black"
                    : ""
                }`}
              >
                <SelectValue placeholder="Director" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {filterOptions.directors.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Writer */}
          <div className="flex flex-col gap-1.5">
            <label
              className={`text-xs ml-1 transition-colors ${
                filters.writer && filters.writer !== "all"
                  ? "font-bold text-foreground"
                  : "font-medium text-muted-foreground"
              }`}
            >
              Escritor
            </label>
            <Select
              value={filters.writer}
              onValueChange={(val) => handleSelectChange("writer", val)}
            >
              <SelectTrigger
                className={`w-[160px] transition-colors ${
                  filters.writer && filters.writer !== "all"
                    ? "border-foreground/40 ring-1 ring-black"
                    : ""
                }`}
              >
                <SelectValue placeholder="Escritor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {filterOptions.writers.map((w) => (
                  <SelectItem key={w} value={w}>
                    {w}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actors */}
          <div className="flex flex-col gap-1.5">
            <label
              className={`text-xs ml-1 transition-colors ${
                filters.actors && filters.actors !== "all"
                  ? "font-bold text-foreground"
                  : "font-medium text-muted-foreground"
              }`}
            >
              Actor
            </label>
            <Select
              value={filters.actors}
              onValueChange={(val) => handleSelectChange("actors", val)}
            >
              <SelectTrigger
                className={`w-[160px] transition-colors ${
                  filters.actors && filters.actors !== "all"
                    ? "border-foreground/40 ring-1 ring-black"
                    : ""
                }`}
              >
                <SelectValue placeholder="Actores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {filterOptions.actors.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-destructive transition-colors ml-auto h-auto py-2 px-3"
              title="Borrar filtros"
            >
              <X className="h-4 w-4 mr-2" />
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground ml-1">
        <span>Total:</span>
        <div className="flex items-center gap-2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <span className="font-semibold text-foreground">
              {total} encontrados
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
