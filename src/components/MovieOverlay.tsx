import { useState, useEffect } from "react";
import { baseUrl, apiKey } from "../modules/ApiLiks";
import { getFormattedDate } from "../modules/types_file";
import axios from "axios";

interface MovieDetails {
  id: number;
  title: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  release_date: string;
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
  title: string;
  poster_path: string;
}

interface Trailer {
  id: string;
  key: string;
  name: string;
  type: string;
}

const MovieOverlay = ({
  movieId,
  isOpen,
  onClose,
}: {
  movieId: number | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [movieCredits, setMovieCredits] = useState<CastMember[]>([]);
  const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([]);
  const [trailers, setTrailers] = useState<Trailer[]>([]);

  useEffect(() => {
    if (!movieId || !isOpen) return;

    const fetchMovieDetails = async () => {
      try {
        const [detailsRes, creditsRes, similarRes, trailersRes] =
          await Promise.all([
            axios.get(`${baseUrl}/movie/${movieId}?api_key=${apiKey}`),
            axios.get(`${baseUrl}/movie/${movieId}/credits?api_key=${apiKey}`),
            axios.get(`${baseUrl}/movie/${movieId}/similar?api_key=${apiKey}`),
            axios.get(`${baseUrl}/movie/${movieId}/videos?api_key=${apiKey}`),
            axios.get(`${baseUrl}/movie/${movieId}/videos?api_key=${apiKey}`),
          ]);

        const detailsData: MovieDetails = await detailsRes.data;
        const creditsData: MovieCreditResponse = await creditsRes.data;
        const similarData: { results: SimilarMovie[] } =
          await similarRes.data;
        const trailersData: { results: Trailer[] } = await trailersRes.data;

        setMovieDetails(detailsData);
        setMovieCredits(creditsData.cast);
        setSimilarMovies(similarData.results);
        setTrailers(
          trailersData.results.filter((video) => video.type === "Trailer")
        );
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchMovieDetails();
  }, [movieId, isOpen]);

  if (!isOpen || !movieDetails) return null;

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
            src={`https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`}
            alt={movieDetails.title}
            className="rounded-lg max-h-[28rem] object-cover"
          />
          <div className="flex flex-col">
            <div className="flex justify-between items-center flex-wrap ">
              <div className="">
                <h2 className="sm:text-5xl text-2xl font-bold movieTitle text-orange-600">
                  {movieDetails.title}
                </h2>
                <p className="sm:text-xl text-sm text-gray-400">
                  {movieDetails.tagline}
                </p>
                <p className="sm:text-lg text-sm text-neutral-300 overviewText">
                  Genres: {movieDetails.genres.map((genre) => genre.name).join(", ")}
                  </p>
              </div>
              <div className="info">
              <p className="sm:text-lg text-sm text-gray-400">
                Runtime: {movieDetails.runtime} Minutes
              </p>
              <p className="sm:text-xl text-sm text-gray-400">
                {getFormattedDate(movieDetails.release_date)}
              </p>
              </div>
          
            </div>

            <p className=" sm:text-2xl mt-4 text-gray-300 text-xl overviewText">
              {movieDetails.overview}
            </p>
          </div>
        </div>

        <div className="flex justify-between flex-wrap sm:flex-nowrap  ">
          {/*//! Trailers */}
          <div className="mt-6 w-full">
            <h3 className=" text-2xl font-bold mb-4 ">Trailer</h3>

            {trailers.length > 0 && (
              <iframe
                key={trailers[0].id} // Use the first trailer
                src={`https://www.youtube.com/embed/${trailers[0].key}`}
                title={trailers[0].name}
                allowFullScreen
                className="rounded-lg w-full h-80 sm:w-full sm:h-80"
              ></iframe>
            )}
          </div>

          {/*//! Cast */}
          <div className="mt-6 xl:w-[38rem] w-full">
            <h3 className="text-2xl font-bold mb-4 text-center">Cast</h3>
            <div
              className="flex items-end justify-center flex-wrap space-x-3 space-y-3
            "
            >
              {movieCredits.slice(0, 10).map((cast) => (
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
            Similar Movies
          </h3>
          <div className="flex justify-around flex-wrap ">
            {similarMovies.slice(0, 7).map((movie) => (
              <div
                key={movie.id}
                className="flex flex-col w-40 justify-start items-center mx-1"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  className="rounded-lg h-60 w-full"
                />
                <p className="text-sm max-w-40 p-2">{movie.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieOverlay;
