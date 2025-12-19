import axios from "axios";

// Usamos el proxy local configurado en next.config.mjs para evitar CORS
// El rewrite redirige /api/proxy -> https://wiremock.dev.eroninternational.com/api/movies
const API_BASE_URL = "/api/proxy";

// Axios instance con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.message);
    return Promise.reject(error);
  }
);

/**
 * Obtiene películas con paginación
 * @param {number} page - Número de página
 * @param {number|string} perPage - Elementos por página (default 10)
 */
export const getMovies = async (page = 1, perPage = 10) => {
  try {
    const params = { page };

    // Configurar per_page
    if (perPage === "all") {
      params.per_page = 100; // Asumimos un número alto para "todas"
    } else if (perPage) {
      params.per_page = perPage;
    }

    const response = await apiClient.get("/search", { params });
    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    console.error("Error completo:", error);
    return {
      data: null,
      error:
        error.response?.data?.message ||
        `Error de conexión (${error.message}). Es posible que la API externa tenga restricciones.`,
    };
  }
};

/**
 * Busca una película por título exacto
 */
export const getMovieByTitle = async (title) => {
  try {
    const response = await getMovies(1);

    if (response.error) {
      return { data: null, error: response.error };
    }

    const decodedTitle = decodeURIComponent(title).toLowerCase();
    const movie = response.data.data?.find(
      (m) => m.Title.toLowerCase() === decodedTitle
    );

    if (!movie) {
      return {
        data: null,
        error: "Película no encontrada en el catálogo actual",
      };
    }

    return { data: movie, error: null };
  } catch (error) {
    return {
      data: null,
      error: error.message || "Error al cargar la película",
    };
  }
};

export const getAllMovies = async () => {
  try {
    const result = await getMovies(1);
    if (result.error) return { data: [], error: result.error };
    return {
      data: result.data.data || [],
      error: null,
    };
  } catch (error) {
    return {
      data: [],
      error: error.message,
    };
  }
};

export default {
  getMovies,
  getMovieByTitle,
  getAllMovies,
};
