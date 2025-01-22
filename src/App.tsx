import Home from "./pages/Home";
import TvShows from "./pages/TvShows";
import { Route, Routes, useLocation } from "react-router-dom";
import Movies from "./pages/Movies";
import Navbar from "./components/Navbar";
import React, { useEffect, useState } from "react";
import { DataTypes } from "./modules/types_file";
import { baseUrl, apiKey } from "./modules/ApiLiks";
import SearchResults from "./components/SearchResults";
import LoadingOverlay from "./components/LoadingOverlay";
import Footer from "./components/Footer";
import MovieOverlay from "./components/MovieOverlay";
import axios from "axios";
import TvOverlay from "./components/TvOverlay";

const App = () => {
  const [searchResults, setSearchResults] = useState<DataTypes[]>([]); //* to store the searched results from api
  const [isSearching, setIsSearching] = useState(false); //* searching state true/false , also used to choose what to display in Cover when search is triggered
  const [buffering, setBuffering] = useState<boolean>(false); //* loading before fetching movies
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation(); //* To track the current route

  // Handle modal movie click
  const handleMovieClick = (movieId: number) => {
    setSelectedId(movieId);
    setIsModalOpen(true);
  };
  const handleTvClick = (tvId: number) => {
    setSelectedId(tvId);
    setIsModalOpen(true);
  };

  useEffect(() => {
    setBuffering(true); // Show loading overlay
    const timeout = setTimeout(() => {
      setBuffering(false); // Hide loading overlay after 1 second
    }, 1000);
    window.scrollTo(0, 0); // Scroll to top
    return () => {
      clearTimeout(timeout); // Cleanup timeout on component unmount
      setSearchQuery(""); //clear search input when page changes
    };
  }, [location.pathname, location]); //

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) {
        setIsSearching(false); // Reset state if search query is empty
        return;
      }

      setIsSearching(true); // Indicate searching
      try {
        const searchUrl = `${baseUrl}/search/multi?query=${searchQuery}&api_key=${apiKey}`;
        const response = await axios.get(searchUrl);
        const data = await response.data;
        setTimeout(() => {
          setSearchResults(data.results || []);
        });
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults(); // Trigger search whenever searchQuery changes
  }, [searchQuery]);

  return (
    <>
      {buffering ? (
        <div className="flex justify-center items-center h-[59rem] loadingOverlay">
          <LoadingOverlay />
        </div>
      ) : (
        <>
          <Navbar onSearch={setSearchQuery} isSearching={isSearching} />
          {isSearching ? (
            <SearchResults searchResults={searchResults} />
          ) : (
            <>
            <Routes>
              <Route path="/" element={<Home handleMovieClick={handleMovieClick}/>} />
              <Route path="movies" element={<Movies handleMovieClick={handleMovieClick}/>} />
              <Route path="tvshows" element={<TvShows handleTvClick={handleTvClick}/>} />
            </Routes>
            <MovieOverlay
                movieId={selectedId}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
            <TvOverlay
                tvId={selectedId}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
            </>
          )}
          <Footer />
        </>
      )}
    </>
  );
};

export default App;
