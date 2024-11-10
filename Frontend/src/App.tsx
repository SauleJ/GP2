import { useRef, useState } from "react";
import { SearchContext } from "./context/SearchContext";
import NavBar from "./components/NavBar";
import HeroSection from "./components/HeroSection";
import Footer from "./components/Footer";

function App() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useState("");

  return (
    <>
      <SearchContext.Provider
        value={{ searchInputRef, searchText, setSearchText }}
      >
        <NavBar />
        <HeroSection />
      </SearchContext.Provider>
      <Footer />
    </>
  );
}

export default App;
