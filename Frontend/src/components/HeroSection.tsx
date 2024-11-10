import {
  Button,
  Text,
  VStack,
  Heading,
  useColorMode,
  Flex,
} from "@chakra-ui/react";
import { useContext } from "react";
import { SearchContext } from "../context/SearchContext";

const HeroSection = () => {
  const { searchInputRef } = useContext(SearchContext);
  const { colorMode } = useColorMode();

  const headingColor = colorMode === "light" ? "blue.500" : "blue.200";
  const textColor = colorMode === "light" ? "gray.600" : "gray.200";
  const buttonVariant = colorMode === "light" ? "solid" : "outline";

  return (
    <Flex
      position="relative"
      w="full"
      py={10}
      px={6}
      textAlign="center"
      direction="column"
      align="center"
      justify="center"
      minHeight={{ base: "calc(100vh - 60px)", md: "auto" }}
      className="md:mt-40"
    >
      <VStack spacing={4} zIndex={50}>
        <Heading as="h1" size="2xl" fontWeight="extrabold" color={headingColor}>
          BookMaven
        </Heading>
        <Text fontSize="xl" color={textColor}>
          Tell us what you like...
        </Text>
        <Text color={textColor}>
          ...and our AI will scour libraries to find your next reading
          adventure.
        </Text>
        <Button
          colorScheme="blue"
          variant={buttonVariant}
          size="lg"
          onClick={() => {
            searchInputRef.current?.focus();
          }}
        >
          Start Your Journey
        </Button>
      </VStack>
    </Flex>
  );
};

export default HeroSection;
