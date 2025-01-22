import { useState, useEffect } from "react";
import { baseUrl, apiKey } from "../modules/ApiLiks";
import { getFormattedDate } from "../modules/types_file";
import noImage from "../assets/noImage.jpg";
import axios from "axios";

interface TvDetails {
  id: number;
  name: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  first_air_date: string;
  genres: { id: number; name: string }[];
  runtime: number;
  vote_average: number;
  tagline: string;
}

interface CastMember {
  id: number;
  name: string;
  profile_path: string | null;
  character: string;
}

interface MovieCreditResponse {
  cast: CastMember[];
  crew: { id: number; name: string; job: string }[];
}

interface SimilarMovie {
  id: number;
  name: string;
  poster_path: string;
}


const TvOverlay = ({
  tvId,
  isOpen,
  onClose,
}: {
  tvId: number | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [tvDetails, setTvDetails] = useState<TvDetails | null>(null);
  const [tvCredits, setTvCredits] = useState<CastMember[]>([]);
  const [similarShows, setSimilarShows] = useState<SimilarMovie[]>([]);


  useEffect(() => {
    if (!tvId || !isOpen) return;

    //Clicking a movie to open the follwoing api links
    const fetchMovieDetails = async () => {
      try {
        const [detailsRes, creditsRes, similarRes] =
          await Promise.all([
            axios.get(`${baseUrl}/tv/${tvId}?api_key=${apiKey}`),
            axios.get(`${baseUrl}/tv/${tvId}/credits?api_key=${apiKey}`),
            axios.get(`${baseUrl}/tv/${tvId}/similar?api_key=${apiKey}`),
            axios.get(`${baseUrl}/tv/${tvId}/videos?api_key=${apiKey}`),
          ]);

        const detailsData: TvDetails = await detailsRes.data;
        const creditsData: MovieCreditResponse = await creditsRes.data;
        const similarData: { results: SimilarMovie[] } = await similarRes.data;
        

        setTvDetails(detailsData);
        setTvCredits(creditsData.cast);
        setSimilarShows(similarData.results);

      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchMovieDetails();
  }, [tvId, isOpen]);

  if (!isOpen || !tvDetails) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 overflow-y-auto  ">
      <div className="relative bg-gray-900 text-white rounded-lg max-w-7xl w-auto h-[50rem] overflow-y-auto scrollable-div">
        {/*//! Close Button */}
        <button
          className="absolute top-2 right-4 text-3xl font-bold hover:scale-125 duration-300 "
          onClick={onClose}
        >
          ✕
        </button>

        {/*//! Movie Photo and Title */}
        <div className="flex flex-col gap-4  ">
          <img
            src={`https://image.tmdb.org/t/p/original${tvDetails.backdrop_path}`}
            alt={tvDetails.name}
            className="rounded-lg max-h-[28rem] object-cover"
          />
          <div className="flex flex-col">
            <div className="flex justify-between items-center flex-wrap ">
              <div className="">
                <h2 className="sm:text-5xl text-2xl font-bold movieTitle text-orange-600">
                  {tvDetails.name}
                </h2>
                <p className="sm:text-xl text-sm text-gray-400">
                  {tvDetails.tagline}
                </p>
                <p className="sm:text-lg text-sm text-neutral-300 overviewText">
                  Genres:{" "}
                  {tvDetails.genres.map((genre) => genre.name).join(", ")}
                </p>
              </div>
              <div className="info">
              
                <p className="sm:text-xl text-sm text-gray-400">
                  {getFormattedDate(tvDetails.first_air_date)}
                </p>
              </div>
            </div>

            <p className=" sm:text-2xl mt-4 text-gray-300 text-xl overviewText">
              {tvDetails.overview}
            </p>
          </div>
        </div>

        <div className="flex justify-center flex-wrap sm:flex-nowrap  ">
         

          {/*//! Cast */}
          <div className="my-6  w-full">
            <h3 className="text-2xl font-bold mb-4 text-center">Cast</h3>
            <div
              className="flex items-end justify-center flex-wrap space-x-3 space-y-3
            "
            >
              {tvCredits.map((cast) => (
                <div
                  key={cast.id}
                  className="flex-shrink-0 flex-wrap text-center w-20"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w200${cast.profile_path}`}
                    alt={cast.name}
                    className="w-14 h-50 rounded-full object-cover mx-auto hover:scale-110 cursor-pointer duration-300 ease-in-out"
                  />
                  <p className="text-sm mt-2 truncate">{cast.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/*//! Similar Movies */}
        <div className="mt-6 ">
          <h3 className="text-2xl font-bold mb-4 text-center">
            Similar Shows
          </h3>
          <div className="flex justify-around flex-wrap ">
            {similarShows.slice(0, 7).map((tv) => (
              <div
                key={tv.id}
                className="flex flex-col w-40 justify-start items-center mx-1"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${tv.poster_path}`}
                  alt={tv.name}
                  className="rounded-lg h-60 w-full"
                  onError={(event) => {
                    event.currentTarget.src = noImage;
                  }}
                />
                <p className="text-sm max-w-40 p-2">{tv.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TvOverlay;
