import { useSearchParams } from "react-router-dom";
import { useSearchBooks } from "../hooks/useSearch";
import { Box, Divider, Grid, Spinner, Text } from "@chakra-ui/react";
import BookCard from "../components/BookCard";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const { data, isLoading, isError, error } = useSearchBooks(query);

  if (isLoading) {
    return (
      <div className="flex align-middle p-2">
        <Spinner className="mr-2" /> Loading...
      </div>
    );
  }
  if (isError) return <div>Error: {error.message}</div>;
  if (!data || data.length === 0) return <div>No results found.</div>;

  return (
    <>
      <Box as="section" mb={4} mt={4}>
        <Text px={5} fontWeight={"bold"} fontSize={"1.2rem"}>
          Search results for: {query}
        </Text>
        <Divider mt={2} mb={2} />
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          }}
          gap={6}
          width="100%"
          maxWidth="6xl"
          mx="auto"
          sx={{
            "@media screen and (min-width: 760px) and (max-width: 960px)": {
              gridTemplateColumns: "repeat(2, 1fr)",
            },
          }}
        >
          {data.map((book) => (
            <BookCard key={book.book_id} book={book} />
          ))}
        </Grid>
      </Box>
    </>
  );
}

export default SearchResults;
