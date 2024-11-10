import { useQuery } from "@tanstack/react-query";
import {
  RecommendationParams,
  apiClient,
  RecommendationResult,
} from "../services/api-client";

export const useRecommendations = ({
  bookId,
  method,
  topN,
}: RecommendationParams) => {
  return useQuery<RecommendationResult[], Error>({
    queryKey: ["getRecommendations", bookId, method, topN],
    queryFn: () => apiClient.getRecommendations({ bookId, method, topN }),
    enabled: !!bookId,
  });
};
