import axios from "axios";

// Ahora usamos nuestra propia API Route para no exponer la Key en el cliente
const API_URL = "/api/poster";

/**
 * Servicio para buscar posters de películas y cachearlos en localStorage
 */
export const getPosterByTitle = async (title) => {
  if (!title) return null;

  // 1. Intentar obtener del cache de localStorage
  try {
    const cacheKey = `movie_poster_${title.toLowerCase()}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Storage no disponible");
    }
  }

  // 2. Si no está en cache, buscar en nuestra API Route (que tiene la key segura en el server)
  try {
    const response = await axios.get(API_URL, {
      params: {
        t: title,
      },
    });

    const posterUrl =
      response.data?.Poster && response.data.Poster !== "N/A"
        ? response.data.Poster
        : null;

    // 3. Guardar en cache si encontramos algo
    if (posterUrl) {
      const cacheKey = `movie_poster_${title.toLowerCase()}`;
      localStorage.setItem(cacheKey, posterUrl);
    }

    return posterUrl;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(`Error buscando poster para ${title}:`, error);
    }
    return null;
  }
};
