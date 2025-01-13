import React, { useState, useEffect } from "react";
import { baseUrl, apiKey } from "../modules/ApiLiks";

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
            fetch(`${baseUrl}/movie/${movieId}?api_key=${apiKey}`),
            fetch(`${baseUrl}/movie/${movieId}/credits?api_key=${apiKey}`),
            fetch(`${baseUrl}/movie/${movieId}/similar?api_key=${apiKey}`),
            fetch(`${baseUrl}/movie/${movieId}/videos?api_key=${apiKey}`),
            fetch(`${baseUrl}/movie/${movieId}/videos?api_key=${apiKey}`),
          ]);

        const detailsData: MovieDetails = await detailsRes.json();
        const creditsData: MovieCreditResponse = await creditsRes.json();
        const similarData: { results: SimilarMovie[] } =
          await similarRes.json();
        const trailersData: { results: Trailer[] } = await trailersRes.json();

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
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 overflow-y-auto ">
      
      <div className="relative bg-gray-900 text-white rounded-lg max-w-7xl w-auto p-6 h-[50rem] overflow-y-auto scrollable-div">
        {/*//! Close Button */}
        <button
          className="absolute top-4 right-4 text-3xl font-bold"
          onClick={onClose}
        >
          ✕
        </button>

        {/*//! Movie Photo and Title */}
        <div className="flex gap-8 p-2">
          <img
            src={`https://image.tmdb.org/t/p/original${movieDetails.poster_path}`}
            alt={movieDetails.title}
            className="rounded-lg max-h-64 object-cover"
          />
          <div className="flex flex-col ">
            <h2 className="text-5xl font-bold movieTitle">
              {movieDetails.title}
            </h2>
            <p className="text-sm text-gray-400">{movieDetails.release_date}</p>
            <p className="mt-4 text-gray-300 text-2xl overviewText">
              {movieDetails.overview}
            </p>
          </div>
        </div>

        <div className=" flex justify-between px-2 navbarText">
          {/*//! Trailers */}
          <div className="mt-6">
            <h3 className=" text-2xl font-bold mb-4">Trailer</h3>
       
              {trailers.length > 0 && (
                <iframe
                  key={trailers[0].id} // Use the first trailer
                  width="200%"
                  height="300"
                  src={`https://www.youtube.com/embed/${trailers[0].key}`}
                  title={trailers[0].name}
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              )}
          </div>

          {/*//! Cast */}
          <div className="mt-6 xl:w-[38rem] ">
            <h3 className="text-2xl font-bold mb-4 text-center">Cast</h3>
            <div className="flex items-end justify-center flex-wrap space-x-3 space-y-3
            ">
              {movieCredits.slice(0, 10).map((cast) => (
                <div key={cast.id} className="flex-shrink-0 text-center">
                  <img
                    src={`https://image.tmdb.org/t/p/w200${cast.profile_path}`}
                    alt={cast.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto"
                  />
                  <p className="text-sm mt-2">{cast.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/*//! Similar Movies */}
        <div className="mt-6">
          <h3 className="text-2xl font-bold mb-4">Similar Movies</h3>
          <div className="flex overflow-x-auto space-x-4">
            {similarMovies.map((movie) => (
              <div
                key={movie.id}
                className="flex-shrink-0 w-36 cursor-pointer"
                onClick={() => {
                  onClose();
                  setTimeout(() => window.scrollTo(0, 0), 200); // Close modal and reset scroll
                }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  className="rounded-lg"
                />
                <p className="text-sm mt-2">{movie.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieOverlay;
