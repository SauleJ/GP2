import { Flex, VStack } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { SearchContext } from "../context/SearchContext";

const Layout = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useState("");
  return (
    <>
      <SearchContext.Provider
        value={{ searchInputRef, searchText, setSearchText }}
      >
        <Flex flexDirection="column" minHeight="100vh">
          <NavBar />
          <VStack as="main">
            <Outlet />
          </VStack>
          <Footer />
        </Flex>
      </SearchContext.Provider>
    </>
  );
};

export default Layout;
