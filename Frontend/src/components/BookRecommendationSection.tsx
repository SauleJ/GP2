import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  VStack,
  Text,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { formatAuthors } from "../services/formatAuthors";
import StarRating from "./StarRating";
import { Link as RouterLink } from "react-router-dom";
import { RecommendationResult } from "../services/api-client";
import RecommendationSkeleton from "./RecommendationSkeleton";

interface Props {
  data: RecommendationResult[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

const BookRecommendationSection = ({
  data,
  isLoading,
  isError,
  error,
}: Props) => {
  const RecommendationHover = useColorModeValue("gray.50", "gray.700");
  if (isLoading) {
    return <RecommendationSkeleton />;
  }
  if (isError) {
    return (
      <Text color="red.500">
        Error loading recommendations: {(error as Error)?.message}
      </Text>
    );
  }
  if (!data || data.length === 0) {
    return <Text color="gray.500">No recommendations found.</Text>;
  }
  return (
    <>
      <Box as="section" py={4}>
        <VStack spacing={4} align="stretch">
          {data &&
            data.map((book) => (
              <Flex
                key={book.book_id}
                direction={{ base: "column", md: "row" }}
                align={{ md: "center" }}
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                _hover={{ bg: RecommendationHover }}
              >
                <Box
                  minW={{ base: "75px", md: "100px" }}
                  mr={{ base: 0, md: 4 }}
                  mb={{ base: 4, md: 0 }}
                >
                  <Image
                    boxSize={{ base: "75px", md: "100px" }}
                    objectFit="contain"
                    src={book.image_url}
                    alt={`Cover of ${book.title}`}
                  />
                </Box>
                <VStack align="start" spacing={1} flex="1">
                  <Text fontWeight="bold" noOfLines={2}>
                    {book.title}
                  </Text>
                  <Text fontSize="sm">{formatAuthors(book.authors)}</Text>
                  <HStack>
                    <StarRating rating={book.average_rating} />
                    <Text
                      fontSize="sm"
                      color="gray.500"
                    >{`(${book.ratings_count} ratings)`}</Text>
                  </HStack>
                  <HStack spacing={2} wrap="wrap">
                    {book.genres.map((genre) => (
                      <Badge key={genre} colorScheme="blue">
                        {genre}
                      </Badge>
                    ))}
                  </HStack>
                </VStack>
                <Button
                  as={RouterLink}
                  to={`/book/${book.book_id}`}
                  colorScheme="blue"
                  size="sm"
                  mt={{ base: 2, md: 0 }}
                >
                  View
                </Button>
              </Flex>
            ))}
        </VStack>
      </Box>
    </>
  );
};

export default BookRecommendationSection;
