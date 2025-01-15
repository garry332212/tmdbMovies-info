import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import user from "../assets/user.png";
import { apiKey, baseUrl, popular, popularShows } from "../modules/ApiLiks";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";

interface NavbarProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, isSearching }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); //*to check when we scroll , upto what point we want navbar to have a background
  const [searchQuery, setSearchQuery] = useState(""); //*store Navbar Search query by user.
  const [movieData, setMovieData] = useState({
    backdropPath: "",
    title: "",
    overview: "",
  }); //*To Show movie as cover background

  //*To store media details (movies/tv) determines which Route you are currently on
  const location = useLocation();

  //*function to add navbar bg color at a certain point on scroll down

  const handleScroll = () => {
    if (window.scrollY > 150) {
      // Change 600 to the height where you want the navbar background to appear
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  //* Fetch media data based on the current route / e.g if you asre on movies cover ll show movies
  const fetchMediaData = async (page: string) => {
    let url = `${baseUrl}/${page}?api_key=${apiKey}`;
    if (page === "tv") {
      url = `${popularShows}`;
    } else {
      url = `${popular}`;
    }

    try {
      const response = await axios.get(url);
      const data = await response.data;
      const randomIndex = Math.floor(Math.random() * data.results.length);
      const randomMedia = data.results[randomIndex];

      if (randomMedia && randomMedia.backdrop_path) {
        setMovieData({
          backdropPath: `https://image.tmdb.org/t/p/original${randomMedia.backdrop_path}`,
          title: randomMedia.title || randomMedia.name || "",
          overview: randomMedia.overview || "",
        });
      }
    } catch (error) {
      console.error("Error fetching media data:", error);
    }
  };

  //*useEffect to handle fetchMedia Function and Scrolling for navbar
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.includes("movies")) {
      fetchMediaData("movie");
    } else if (currentPath.includes("tvshows")) {
      fetchMediaData("tv");
    } else {
      fetchMediaData("movie"); //* Default to movies on the home page
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  //*Searching for a movie using searchbar
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    // *Background Cover Image
    <div
      className={`relative bg-cover bg-center ${
        isSearching ? "h-40" : "h-screen"
      } text-white duration-500 ease-in-out`}
      style={{ backgroundImage: `url(${movieData.backdropPath})` }}
    >
      {/*//* Navbar */}
      <div
        className={`fixed p-10 left-0 top-0 w-full z-50 duration-500 ease-in-out ${
          isScrolled
            ? "bg-black/70 "
            : "bg-gradient-to-b from-black/70 to-transparent  "
        }`}
      >
        <div className="flex justify-between items-center h-24 px-6 ">
          <img
            src={logo}
            alt="logo"
            className="relative  xl:w-[170px] lg:w-[140px] w-32 logoAnimation "
          />

          {/*//* Navigation Links */}
          <div className="hidden md:flex space-x-10 lg:text-3xl md:text-xl font-bold text-gray-300 navbarText">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `cursor-pointer hover:text-white ${
                  isActive ? "text-orange-600  scale-125 " : ""
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/movies"
              className={({ isActive }) =>
                `cursor-pointer hover:text-white ${
                  isActive ? "text-orange-600 scale-150" : ""
                }`
              }
            >
              Movies
            </NavLink>
            <NavLink
              to="/tvshows"
              className={({ isActive }) =>
                `cursor-pointer hover:text-white ${
                  isActive ? "text-orange-600  scale-125" : ""
                }`
              }
            >
              TV Shows
            </NavLink>
          </div>

          {/*//* Search & User */}
          <div className="hidden md:flex items-center">
            <input
              value={searchQuery}
              onChange={handleSearchChange}
              type="text"
              placeholder="Search"
              className="border-none outline-none p-2 px-4 xl:w-96 lg:w-56 md:w-44 bg-[#f8f8f837]  rounded-full text-white placeholder-neutral-300"
            />

            <span className="relative -left-8 material-symbols-outlined">
              search
            </span>
            <img
              src={user}
              alt="user"
              className="w-10 h-10 rounded-full cursor-pointer duration-300 ease-in-out hover:scale-110 hover:rotate-90 "
            />
          </div>

          {/*//* Hamburger Menu */}
          <button
            className="block md:hidden text-white text-3xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/*//* Mobile Menu */}
      {/*//* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full bg-black bg-opacity-90 text-white z-50 transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <button
          className="absolute top-4 right-4 text-3xl"
          onClick={() => setIsMenuOpen(false)}
        >
          ✕
        </button>
        <div className="flex flex-col items-start space-y-4 py-8 px-6">
          <NavLink
            to="/"
            className="cursor-pointer text-xl hover:text-gray-400"
          >
            Home
          </NavLink>
          <NavLink
            to="tvshows"
            className="cursor-pointer text-xl hover:text-gray-400"
          >
            TV Shows
          </NavLink>
          <NavLink
            to="movies"
            className="cursor-pointer text-xl hover:text-gray-400"
          >
            Movies
          </NavLink>
        </div>
        <div className="mt-4 px-6">
          <input
            value={searchQuery}
            onChange={handleSearchChange}
            type="text"
            placeholder="Search"
            className="w-full p-2 bg-gray-300 rounded-full text-black placeholder-gray-500"
          />
        </div>
      </div>

      {/*//* Movie Details for Cover Image */}
      <div className="absolute inset-0 flex flex-col justify-center items-start text-left px-8 bg-black bg-opacity-50 ">
        {!isSearching && (
          <>
            <h1 className="text-5xl font-bold mb-4 movieTitle space tracking-wider">
              {movieData.title}
            </h1>

            <p className="overviewText text-xl max-w-2xl">
              {movieData.overview}
            </p>

            <button className="mt-4 px-2 py-2 bg-[#9d9a96ac] font-bold rounded-lg ease-in-out duration-500 hover:bg-white hover:text-black navbarText flex flex-row-reverse items-center justify-around w-28">
              More Info
              <span className="material-symbols-outlined">info</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
