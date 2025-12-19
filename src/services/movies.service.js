import axios from "axios";
import { slugify } from "@/lib/utils";

// Usamos /api-proxy/ que se redirige en next.config.mjs a la URL definida en el .env
const API_BASE_URL = "/api-proxy/";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo mostramos logs detallados en desarrollo para evitar filtrar información
    if (process.env.NODE_ENV === "development") {
      console.group("DEBUG - Error de API");
      console.error("URL Intentada:", error.config?.url);
      console.error("BaseURL:", error.config?.baseURL);
      console.error("Status:", error.response?.status);
      console.error("Data de respuesta:", error.response?.data);
      console.groupEnd();
    }
    return Promise.reject(error);
  }
);

export const getMovies = async (page = 1, perPage = 10) => {
  try {
    // Al no poner "/" al principio de "search", Axios lo concatena a la baseURL correctamente
    const response = await apiClient.get("search", {
      params: {
        page,
        per_page: perPage === "all" ? 100 : perPage,
      },
    });

    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: `Error: ${
        error.response?.status || error.message
      }. Mira la consola para detalles.`,
    };
  }
};

export const getMovieByTitle = async (slug) => {
  try {
    const response = await getAllMovies();
    if (response.error) return { data: null, error: response.error };

    const movie = response.data?.find((m) => slugify(m.Title) === slug);

    return movie
      ? { data: movie, error: null }
      : { data: null, error: "Película no encontrada" };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const getAllMovies = async () => {
  try {
    let allMovies = [];
    let currentPage = 1;
    let totalPages = 1;

    // Hacemos la primera petición para obtener la data y el total de páginas
    const firstResult = await getMovies(1, 100);
    if (firstResult.error) return { data: [], error: firstResult.error };

    allMovies = [...(firstResult.data.data || [])];
    totalPages = firstResult.data.total_pages || 1;

    // Si hay más páginas, las traemos todas
    const pagePromises = [];
    for (let p = 2; p <= totalPages; p++) {
      pagePromises.push(getMovies(p, 100));
    }

    if (pagePromises.length > 0) {
      const remainingResults = await Promise.all(pagePromises);
      remainingResults.forEach((res) => {
        if (!res.error && res.data?.data) {
          allMovies = [...allMovies, ...res.data.data];
        }
      });
    }

    return { data: allMovies, error: null };
  } catch (error) {
    return { data: [], error: error.message };
  }
};

export default { getMovies, getMovieByTitle, getAllMovies };
