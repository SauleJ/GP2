import { useQuery } from "@tanstack/react-query";
import { apiClient, BookDetails } from "../services/api-client";

export const useSearchBooks = (query: string) => {
  return useQuery<BookDetails[], Error>({
    queryKey: ["searchBooks", query],
    queryFn: () => apiClient.searchBooks(query),
    enabled: !!query,
  });
};
