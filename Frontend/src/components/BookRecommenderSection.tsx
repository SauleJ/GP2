import {
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface Props {
  method: string;
  setMethod: (method: string) => void;
  topN: number;
  setTopN: (topN: number) => void;
}

const playfulTexts = [
  "Buckle up, bookworms! These tales are about to take you on an epic adventure!",
  "Who needs a magic carpet? These books are your next ride to fantastic worlds!",
  "Ready for a plot twist? These page-turners are lined up and ready to blow your mind!",
  "Calling all literary explorers! Discover your next book treasure right here!",
  "Wave goodbye to boredom. These books are the party your shelves have been waiting for!",
  "Hungry for a good story? Feast your eyes on these delicious reads!",
  "As the pages turn... Here are stories that'll make your heart yearn!",
  "Don’t judge a book by its cover, but go ahead and judge these – they’re all winners!",
  "Cure for the common read? Look no further, these books have everything you need!",
  "Step right up to the buffet of books where every pick is a chef's kiss!",
  "Psst... your bookshelf is about to get jealous. Check out these new reads!",
];

const BookRecommenderSection = ({
  method,
  setMethod,
  topN,
  setTopN,
}: Props) => {
  const [randomText, setRandomText] = useState("");

  useEffect(() => {
    const getRandomText = () => {
      const randomIndex = Math.floor(Math.random() * playfulTexts.length);
      return playfulTexts[randomIndex];
    };
    setRandomText(getRandomText());
  }, []);

  useEffect(() => {
    if (method === "Content-Based") {
      setTopN(50);
    } else if (topN >= 50) {
      setTopN(10);
    }
  }, [method, setTopN, topN]);

  return (
    <Box as="section" maxW="6xl" mx="auto" px={4} py={6} width="full">
      <VStack
        spacing={4}
        alignItems={{ base: "center", md: "stretch" }}
        width="full"
      >
        <Text
          fontSize="xl"
          fontWeight="bold"
          textAlign={{ base: "center", md: "left" }}
        >
          {randomText}
        </Text>
        <HStack
          spacing={4}
          justifyContent={{ base: "center", md: "flex-start" }}
          width="full"
          wrap={{ base: "wrap", md: "nowrap" }}
        >
          <Menu>
            <MenuButton as={Button} colorScheme="blue">
              Recommender: {method}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => setMethod("Content-Based")}>
                Content-Based
              </MenuItem>
              <MenuItem onClick={() => setMethod("Collaborative")}>
                Collaborative
              </MenuItem>
              <MenuItem onClick={() => setMethod("Hybrid")}>Hybrid</MenuItem>
            </MenuList>
          </Menu>
          {method !== "Content-Based" && (
            <Select
              ml={2}
              w="auto"
              value={topN.toString()}
              onChange={(e) => setTopN(parseInt(e.target.value, 10))}
            >
              <option value="5">5 Books</option>
              <option value="10">10 Books</option>
              <option value="15">15 Books</option>
            </Select>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

export default BookRecommenderSection;
