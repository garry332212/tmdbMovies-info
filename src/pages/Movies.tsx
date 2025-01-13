import DisplayItems from "../components/DisplayItems";
import { now_playing, popular, top_rated_movies, upcoming,  } from "../modules/ApiLiks";
import { createDisplayItems, ItemsCategory } from "../modules/types_file";

const Movies = ({ handleMovieClick }: { handleMovieClick: (movieId: number) => void }) => {
  const displayCategories: ItemsCategory[] = [
    createDisplayItems(now_playing, "Now Playing"),
    createDisplayItems(upcoming, "Upcoming"),
    createDisplayItems(popular, "Popular"),
    createDisplayItems(top_rated_movies, "Top Rated Movies Of All Time"),
  ];
  return (
    <div>
      <DisplayItems displayTags={displayCategories} handleMovieClick={handleMovieClick}/>
    </div>
  );
};

export default Movies;
