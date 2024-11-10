import { createContext, Dispatch, RefObject, SetStateAction } from "react";

interface SearchContextProps {
  searchInputRef: RefObject<HTMLInputElement>;
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
}

export const SearchContext = createContext<SearchContextProps>(null!);
