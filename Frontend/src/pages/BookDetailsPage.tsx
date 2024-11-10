import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import BookDetailSection from "../components/BookDetailSection";
import BookRecommendationSection from "../components/BookRecommendationSection";
import { useBookDetails } from "../hooks/useBookDetails";
import { useRecommendations } from "../hooks/useRecommendations";
import BookRecommenderSection from "../components/BookRecommenderSection";

const BookDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: bookDetails,
    isLoading: isDetailsLoading,
    isError: isDetailsError,
    error: detailsError,
  } = useBookDetails(id || "");
  const [method, setMethod] = useState("Content-Based");
  const [topN, setTopN] = useState(5);
  const {
    data: recommendations,
    isLoading: isRecommendationsLoading,
    isError: isRecommendationsError,
    error: recommendationsError,
  } = useRecommendations({
    bookId: id || "",
    method: method,
    topN: topN,
  });

  if (isDetailsLoading) {
    return (
      <Flex align="center" justify="center" p={4}>
        <Spinner mr={2} /> Loading...
      </Flex>
    );
  }

  if (isDetailsError)
    return <Text color="red.500">Error: {detailsError?.message}</Text>;
  if (!bookDetails) return <Text color="gray.500">No results found.</Text>;

  return (
    <>
      <BookDetailSection data={bookDetails} />
      <BookRecommenderSection
        method={method}
        setMethod={setMethod}
        topN={topN}
        setTopN={setTopN}
      />
      <BookRecommendationSection
        data={recommendations}
        isLoading={isRecommendationsLoading}
        isError={isRecommendationsError}
        error={recommendationsError}
      />
    </>
  );
};

export default BookDetailsPage;
