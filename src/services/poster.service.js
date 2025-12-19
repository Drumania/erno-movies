import axios from "axios";

// OMDb API Key desde el .env
// Recuerda usar el prefijo NEXT_PUBLIC_ para que sea accesible en el cliente
const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
const API_URL = "https://www.omdbapi.com/";

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
    console.warn("Storage no disponible");
  }

  // 2. Si no está en cache, buscar en la API de OMDb
  try {
    const response = await axios.get(API_URL, {
      params: {
        t: title,
        apikey: OMDB_API_KEY,
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
    if (error.response?.status === 401) {
      console.error(
        "OMDb API Key inválida o expirada. Por favor obtén una en http://www.omdbapi.com/"
      );
    } else {
      console.error(`Error buscando poster para ${title}:`, error);
    }
    return null;
  }
};
