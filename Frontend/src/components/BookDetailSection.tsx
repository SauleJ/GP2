import {
  Badge,
  Box,
  Button,
  Divider,
  Grid,
  HStack,
  Skeleton,
  VStack,
  Text,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { BookDetails } from "../services/api-client";
import { formatAuthors } from "../services/formatAuthors";
import StarRating from "./StarRating";
import { Link as RouterLink } from "react-router-dom";

interface Props {
  data: BookDetails | undefined;
}

const BookDetailSection = ({ data }: Props) => {
  if (!data) {
    return (
      <>
        <Spinner /> <Text>Loading book details...</Text>;
      </>
    );
  }
  return (
    <Box as="section" maxW="6xl" m="auto" p={4}>
      <Grid
        templateColumns={{ md: "1fr 3fr", base: "1fr" }}
        gap={6}
        justifyContent={{ base: "center", md: "start" }}
        textAlign={{ base: "center", md: "left" }}
      >
        <Box>
          <Image
            src={data.image_url}
            alt={`Cover of ${data.title}`}
            objectFit="contain"
            boxSize={{ md: "300px", base: "200px" }}
            fallback={<Skeleton boxSize={{ md: "300px", base: "200px" }} />}
            m={{ base: "0 auto", md: "0" }}
          />
        </Box>
        <VStack align={{ base: "center", md: "start" }} spacing={4}>
          <Text fontSize="2xl" fontWeight="bold">
            {data.title}
          </Text>
          <Text fontSize="lg">{formatAuthors(data.authors)}</Text>
          <HStack>
            <StarRating rating={data.average_rating} />
            <Text fontSize="sm">{data.average_rating}</Text>
            <Text fontSize="sm">{`(${data.ratings_count} ratings)`}</Text>
          </HStack>
          <Text fontSize="md">{data.description}</Text>
          <Text fontSize="sm">{`Pages: ${data.pages}`}</Text>
          <HStack wrap="wrap" spacing={2}>
            {data.genres.map((genre, index) => (
              <Badge key={index} colorScheme="blue">
                {genre}
              </Badge>
            ))}
          </HStack>
          <Divider />
          <Button
            as={RouterLink}
            to={
              "https://www.goodreads.com/search?query=" +
              encodeURIComponent(data.title)
            }
            target="_blank"
            size="md"
            colorScheme="blue"
            cursor="pointer"
            variant="outline"
          >
            View on Goodreads
          </Button>
        </VStack>
      </Grid>
    </Box>
  );
};

export default BookDetailSection;
