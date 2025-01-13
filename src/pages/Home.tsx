import DisplayItems from "../components/DisplayItems";
import { createDisplayItems, ItemsCategory } from "../modules/types_file";
import {
  airing_today,
  now_playing,
  popular,
  popularShows,
  trendingShows,
  upcoming,
} from "../modules/ApiLiks";



const Home = ({handleMovieClick} : {handleMovieClick: (movieId:number) => void}) => {
  const chooseWhatToDisplay: ItemsCategory[] = [
    createDisplayItems(now_playing, "Now Playing"),
    createDisplayItems(popular, "Popular Movies"),
    createDisplayItems(upcoming, "Upcoming"),
    createDisplayItems(trendingShows, "Trending Shows"),
    createDisplayItems(popularShows, "Popular Shows"),
    createDisplayItems(airing_today, "On Air Today"),
  ];

  return (
    <>
      <div className=" ">
        <DisplayItems displayTags={chooseWhatToDisplay} handleMovieClick={handleMovieClick}/>
      </div>
    </>
  );
};

export default Home;
