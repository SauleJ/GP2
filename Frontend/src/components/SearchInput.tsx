import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import { SearchContext } from "../context/SearchContext";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
  const { searchInputRef, searchText, setSearchText } =
    useContext(SearchContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.value = searchText;
    }
  }, [searchText, searchInputRef]);

  const handleSearch = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (searchInputRef.current) {
      const query = searchInputRef.current.value.trim();
      if (query) {
        setSearchText(query);
        navigate(`/search?query=${encodeURIComponent(query)}`);
      }
      throw new Error("You must enter a search term.");
    }
  };

  return (
    <form style={{ width: "100%", maxWidth: "600px" }} onSubmit={handleSearch}>
      <InputGroup>
        <InputLeftElement children={<BsSearch />} />
        <Input
          ref={searchInputRef}
          borderRadius={20}
          placeholder="Search books..."
          variant="filled"
        />
      </InputGroup>
    </form>
  );
};

export default SearchInput;
