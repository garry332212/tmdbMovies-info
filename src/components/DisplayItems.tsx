import React, { useEffect, useState } from "react";

import axios from "axios";
import { ItemsCategory, DataTypes } from "../modules/types_file";
import noImage from "../assets/noImage.jpg";

//*Types for passing props that are coming from HOME/Movies/TvShows
interface DisplayItemsProps {
  displayTags: ItemsCategory[];
  handleMovieClick: (movieId: number) => void;
}

const DisplayItems: React.FC<DisplayItemsProps> = ({
  displayTags,
  handleMovieClick,
}) => {
  return (
    <>
      {displayTags.map(({ apiEndpoint, itemHeading }) => (
        <CategorySection
          key={apiEndpoint}
          apiEndpoint={apiEndpoint}
          itemHeading={itemHeading}
          handleMovieClick={handleMovieClick}
        />
      ))}
    </>
  );
};

//* Types for props coming from above CategorySection

//*Category Section Component for rendering movies via categorioes

interface CategorySecProps extends ItemsCategory {
  handleMovieClick: (movieId: number) => void;
}
const CategorySection: React.FC<CategorySecProps> = ({
  apiEndpoint,
  itemHeading,
  handleMovieClick,
}) => {
  const [movies, setMovies] = useState<DataTypes[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(apiEndpoint);
        setMovies(response.data.results.slice(0, 7));
      } catch (error) {
        console.error("Error fetching movies", error);
      }
    };

    fetchMovies();
  }, [apiEndpoint]);

  return (
    <div className="bg-gray-900">
      <div className="my-6  text-center  sm:w-56 bg-gradient-to-l from-gray-900 to-gray-800">
        <h1 className="navbarText font-bold lg:text-2xl md:text-2xl  text-neutral-50 p-4 py-1 rounded-xl animatetext">
          {itemHeading}
        </h1>
      </div>
      <div className="flex flex-wrap justify-evenly space-x-0  mt-1 mx-4 items-start">
        {movies.map((movie) => (
          <div
            className="text-neutral-300 flex items-center flex-col justify-center bg-slate-0 rounded-lg  pt-4 mt-4 w-64 h-[24rem] m-1 cursor-pointer scale-95 hover:scale-100 hover:shadow-[0px_1px_5px_1px_#ffea0076] duration-200"
            onClick={() => handleMovieClick(movie.id)}
            key={movie.id}
          >
            <img
              src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
              alt={movie.title || movie.name}
              className="rounded-lg  border-0 w-60 hover:shadow-[0_-10px_12px_1px_#ffea0076] animatetext"
              onError={(event) => {
                event.currentTarget.src = noImage;
              }}
            />
            <div className="p-1">
              <p className=" text-xl font-bold truncate-text">
                {movie.title}
              </p>
            </div>

            <div className="pb-2">
              <p className="text-xl  font-bold truncate-text">
                {movie.name}
              </p>
            </div>

            <p className="flex items-center justify-center text-center rounded-md w-14 relative right-[6.5rem] bottom-[25.5rem] font-semibold text-lg text-black bg-[#ffea00c7] ">
              {movie.vote_average.toFixed(1)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayItems;
