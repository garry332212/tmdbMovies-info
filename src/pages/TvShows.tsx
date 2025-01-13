import DisplayItems from "../components/DisplayItems";
import {
  airing_today,
  popularShows,
  top_rated_shows,
  trendingShows,
} from "../modules/ApiLiks";
import { createDisplayItems, ItemsCategory } from "../modules/types_file";

const TvShows = ({ handleMovieClick }: { handleMovieClick: (movieId: number) => void }) => {
  const displayCategories: ItemsCategory[] = [
    createDisplayItems(trendingShows, "Trending Shows"),
    createDisplayItems(airing_today, "Watch On Tv 📺"),
    createDisplayItems(popularShows, "Popular"),
    createDisplayItems(top_rated_shows, "Top Rated Shows"),
  ];

  return (
    <div>
      <DisplayItems displayTags={displayCategories} handleMovieClick={handleMovieClick}/>
    </div>
  );
};

export default TvShows;
