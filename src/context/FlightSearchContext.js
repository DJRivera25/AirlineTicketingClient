// FlightSearchContext.js
import { createContext, useState } from "react";
import axios from "axios";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState(null); // To persist last search input

  const searchFlights = async (query) => {
    try {
      const res = await axios.post("http://localhost:4000/flights/search", query); // ✅ send in body
      setSearchResults(res.data);
      setSearchQuery(query);
    } catch (error) {
      console.error("Flight search failed:", error.response?.data || error.message);
      setSearchResults([]);
    }
  };

  return (
    <SearchContext.Provider value={{ searchResults, searchQuery, searchFlights }}>{children}</SearchContext.Provider>
  );
};

export default SearchContext;
