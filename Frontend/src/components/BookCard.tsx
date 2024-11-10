import {
  Box,
  GridItem,
  Image,
  Skeleton,
  VStack,
  HStack,
  Button,
  useColorModeValue,
  Text,
  Heading,
  Flex,
} from "@chakra-ui/react";
import { BookDetails } from "../services/api-client";
import { Link as RouterLink } from "react-router-dom";
import StarRating from "./StarRating";
import { formatAuthors } from "../services/formatAuthors";

interface Props {
  book: BookDetails;
}

const BookCard = ({ book }: Props) => {
  const bgSkeleton = useColorModeValue("gray.200", "gray.700");
  const cardBg = useColorModeValue("white", "gray.800");

  return (
    <GridItem key={book.book_id} as="section">
      <Box
        bg={cardBg}
        boxShadow="sm"
        borderRadius="md"
        overflow="hidden"
        transition="all 0.2s"
        _hover={{ boxShadow: "md" }}
        p={4}
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="space-between"
        >
          <Box flexShrink={0} mb={{ base: 4, md: 0 }}>
            <Image
              src={book.image_url}
              alt={`Cover of the book ${book.title}`}
              objectFit="contain"
              boxSize="100px"
              fallback={<Skeleton boxSize="100px" startColor={bgSkeleton} />}
            />
          </Box>
          <VStack align="start" flex="1" spacing={4}>
            <Heading as="h3" size="sm">
              {book.title}
            </Heading>
            <Text as="p" fontSize="sm" color="gray.500">
              by {formatAuthors(book.authors)}
            </Text>
            <HStack spacing={1}>
              <StarRating rating={book.average_rating} />
              <Text as="span" fontSize="sm">
                {book.average_rating} ({book.ratings_count})
              </Text>
            </HStack>
            <Flex direction={{ base: "column", md: "row" }} gap={2}>
              <Button
                as={RouterLink}
                to={`/book/${book.book_id}`}
                size="sm"
                colorScheme="blue"
              >
                View
              </Button>
              <Button
                as={RouterLink}
                to={
                  "https://www.goodreads.com/search?query=" +
                  encodeURIComponent(book.title)
                }
                size="sm"
                variant="outline"
                colorScheme="blue"
              >
                Details
              </Button>
            </Flex>
          </VStack>
        </Flex>
      </Box>
    </GridItem>
  );
};

export default BookCard;
