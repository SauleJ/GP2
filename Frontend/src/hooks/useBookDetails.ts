import { useQuery } from "@tanstack/react-query";
import { BookDetails, apiClient } from "../services/api-client";

export const useBookDetails = (bookId: string) => {
  return useQuery<BookDetails, Error>({
    queryKey: ["bookDetails", bookId],
    queryFn: () => apiClient.getBookDetails(bookId),
    enabled: !!bookId,
  });
};
