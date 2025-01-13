import React, { useEffect, useState } from "react";

import axios from "axios";
import { ItemsCategory, Movie } from "../modules/types_file";

//*Types for passing props that are coming from HOME/Movies/TvShows
interface DisplayItemsProps {
  displayTags: ItemsCategory[];
  handleMovieClick: (movieId:number ) => void
}

const DisplayItems: React.FC<DisplayItemsProps> = ({ displayTags,handleMovieClick }) => {
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

interface CategorySecProps  extends ItemsCategory{
  handleMovieClick:(movieId:number) => void
}
const CategorySection: React.FC<CategorySecProps> = ({
  apiEndpoint,
  itemHeading,
  handleMovieClick
  
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);

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
    <div>
      <div className="my-6  text-left  sm:w-full bg-gradient-to-l from-stone-900 to-zinc-700">
        <h1 className="navbarText font-bold lg:text-2xl md:text-2xl  text-neutral-50 p-4 py-1 rounded-xl animatetext">
          {itemHeading}
        </h1>
      </div>
      <div className="flex flex-wrap justify-evenly space-x-0  mt-1 mx-4 items-start">
        {movies.map((movie) => (
          <div
            className="text-neutral-300 flex items-center flex-col justify-center bg-slate-0 rounded-lg bg-gradient-to-r from-green-950 to-cyan-700 pt-4 mt-4 w-64 h-[24rem] m-1 cursor-pointer scale-95 shadow-[0px_1px_5px_1px_#c342426f] hover:scale-100 transition-transform hover:shadow-none duration-300"  onClick={() => handleMovieClick(movie.id)}
            key={movie.id}
          >
            <img
              src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
              alt={movie.title || movie.name}
              className="rounded-lg  border-0 w-60 shadow-[0_-10px_12px_1px_#ffea0076] animatetext"
            />
            <div className="p-1">
              <p className=" text-xl p-0 font-bold  text-nowrap truncate-text">
                {movie.title}
              </p>
            </div>

            <div className="pb-2">
              <p className="text-xl  font-bold  text-nowrap truncate-text">
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
