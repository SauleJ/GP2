import { Box, HStack, Heading, useColorModeValue } from "@chakra-ui/react";
import SearchInput from "./SearchInput";
import ColorModeSwitch from "./ColorModeSwitch";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { SearchContext } from "../context/SearchContext";

const NavBar = () => {
  const { setSearchText } = useContext(SearchContext);
  const bgColor = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("gray.600", "white");

  return (
    <Box as="nav" bg={bgColor}>
      <HStack
        padding="10px"
        justifyContent="space-between"
        alignItems="center"
        maxWidth="1200px"
        margin="0 auto"
        width="100%"
      >
        <Link to="/" onClick={() => setSearchText("")}>
          <Heading as="h1" size="lg" color={color} fontWeight="bold">
            BookMaven
          </Heading>
        </Link>
        <SearchInput />
        <ColorModeSwitch />
      </HStack>
    </Box>
  );
};

export default NavBar;
