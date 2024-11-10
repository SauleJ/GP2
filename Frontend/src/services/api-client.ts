import axios from "axios";

export interface BookDetails {
  book_id: string;
  title: string;
  authors: string;
  average_rating: number;
  ratings_count: number;
  image_url: string;
  pages: number;
  description: string;
  genres: string[];
}

export interface RecommendationParams {
  bookId: string;
  method: string;
  topN: number;
}

export interface RecommendationResult {
  book_id: string;
  title: string;
  authors: string;
  average_rating: number;
  ratings_count: number;
  image_url: string;
  genres: string[];
}

const BASE_URL = process.env.REACT_APP_BACKEND_DOMAIN;

function camelToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function transformParams(params: object): object {
  const newParams: Record<string, unknown> = {};
  Object.keys(params).forEach((key) => {
    newParams[camelToSnakeCase(key)] = params[key as keyof typeof params];
  });
  return newParams;
}

async function apiRequest<T>(url: string, params?: object): Promise<T> {
  try {
    const response = await axios.get<T>(`${BASE_URL}/${url}`, { params });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
  throw new Error("An error occurred while fetching data.");
}

function handleApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    const message = error.response?.data.message || error.message;
    throw new Error(message);
  }
  throw new Error("An error occurred while fetching data.");
}

export const apiClient = {
  searchBooks(query: string): Promise<BookDetails[]> {
    if (!query) throw new Error("No query provided");
    return apiRequest<BookDetails[]>("search", { query });
  },
  getBookDetails(bookId: string): Promise<BookDetails> {
    if (!bookId) throw new Error("No book ID provided");
    return apiRequest<BookDetails>(`book/${bookId}`);
  },
  async getRecommendations(
    params: RecommendationParams
  ): Promise<RecommendationResult[]> {
    const transformedParams = transformParams(params);
    return apiRequest<RecommendationResult[]>("recommend", transformedParams);
  },
};
