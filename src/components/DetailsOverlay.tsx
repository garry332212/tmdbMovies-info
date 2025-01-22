import { useState, useEffect } from "react";
import { baseUrl, apiKey } from "../modules/ApiLiks";
import { getFormattedDate } from "../modules/types_file";
import noImage from "../assets/noImage.jpg";
import axios from "axios";
//todo NOT IN USE //
//!NOT IN USE CURRENTLY
interface Details {
  id: number;
  title?: string; // Movies use `title`
  name?: string; // TV shows use `name`
  backdrop_path: string;
  poster_path: string;
  overview: string;
  release_date?: string; // Movies use `release_date`
  first_air_date?: string; // TV shows use `first_air_date`
  genres: { id: number; name: string }[];
  runtime?: number; // Movies use `runtime`
  episode_run_time?: number[]; // TV shows use `episode_run_time`
  vote_average: number;
  tagline: string;
}

interface CastMember {
  id: number;
  name: string;
  profile_path: string | null;
  character: string;
}

interface SimilarItem {
  id: number;
  title?: string; // Movies use `title`
  name?: string; // TV shows use `name`
  poster_path: string;
}

interface Trailer {
  id: string;
  key: string;
  name: string;
  type: string;
}

const Overlay = ({
  id,
  isOpen,
  type, // "movie" or "tv"
  onClose,
}: {
  id: number | null;
  isOpen: boolean;
  type: "movie" | "tv";
  onClose: () => void;
}) => {
  const [details, setDetails] = useState<Details | null>(null);
  const [credits, setCredits] = useState<CastMember[]>([]);
  const [similarItems, setSimilarItems] = useState<SimilarItem[]>([]);
  const [trailers, setTrailers] = useState<Trailer[]>([]);

  useEffect(() => {
    if (!id || !isOpen) return;

    const fetchData = async () => {
      try {
        const [detailsRes, creditsRes, similarRes, trailersRes] =
          await Promise.all([
            axios.get(`${baseUrl}/${type}/${id}?api_key=${apiKey}`),
            axios.get(`${baseUrl}/${type}/${id}/credits?api_key=${apiKey}`),
            axios.get(`${baseUrl}/${type}/${id}/similar?api_key=${apiKey}`),
            axios.get(`${baseUrl}/${type}/${id}/videos?api_key=${apiKey}`),
          ]);

        const detailsData: Details = await detailsRes.data;
        const creditsData = await creditsRes.data;
        const similarData = await similarRes.data;
        const trailersData = await trailersRes.data;

        setDetails(detailsData);
        setCredits(creditsData.cast || []);
        setSimilarItems(similarData.results || []);
        setTrailers(
          trailersData.results?.filter((video: Trailer) => video.type === "Trailer") || []
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, isOpen, type]);

  if (!isOpen || !details) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 overflow-y-auto">
      <div className="relative bg-gray-900 text-white rounded-lg max-w-7xl w-auto h-[50rem] overflow-y-auto scrollable-div">
        {/* Close Button */}
        <button
          className="absolute top-2 right-4 text-3xl font-bold hover:scale-125 duration-300"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Main Content */}
        <div className="flex flex-col gap-4">
          <img
            src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
            alt={details.title || details.name}
            className="rounded-lg max-h-[28rem] object-cover"
          />
          <div className="flex flex-col">
            <div className="flex justify-between items-center flex-wrap">
              <div>
                <h2 className="sm:text-5xl text-2xl font-bold movieTitle text-orange-600">
                  {details.title || details.name}
                </h2>
                <p className="sm:text-xl text-sm text-gray-400">
                  {details.tagline}
                </p>
                <p className="sm:text-lg text-sm text-neutral-300 overviewText">
                  Genres: {details.genres.map((genre) => genre.name).join(", ")}
                </p>
              </div>
              <div className="info">
                {type === "movie" && details.runtime && (
                  <p className="sm:text-lg text-sm text-gray-400">
                    Runtime: {details.runtime} Minutes
                  </p>
                )}
                {type === "tv" && details.episode_run_time?.length && (
                  <p className="sm:text-lg text-sm text-gray-400">
                    Runtime: {details.episode_run_time[0]} Minutes
                  </p>
                )}
                <p className="sm:text-xl text-sm text-gray-400">
                  {getFormattedDate(
                    details.release_date || details.first_air_date || ""
                  )}
                </p>
              </div>
            </div>
            <p className="sm:text-2xl mt-4 text-gray-300 text-xl overviewText">
              {details.overview}
            </p>
          </div>
        </div>

        {/* Trailers */}
        {trailers.length > 0 && (
          <div className="mt-6 w-full">
            <h3 className="text-2xl font-bold mb-4">Trailer</h3>
            <iframe
              key={trailers[0].id}
              src={`https://www.youtube.com/embed/${trailers[0].key}`}
              title={trailers[0].name}
              allowFullScreen
              className="rounded-lg w-full h-80 sm:w-full sm:h-80"
            ></iframe>
          </div>
        )}

        {/* Cast */}
        <div className="my-6 w-full">
          <h3 className="text-2xl font-bold mb-4 text-center">Cast</h3>
          <div className="flex items-end justify-center flex-wrap space-x-3 space-y-3">
            {credits.slice(0,7).map((cast) => (
              <div key={cast.id} className="flex-shrink-0 text-center w-20">
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

        {/* Similar Items */}
        <div className="mt-6">
          <h3 className="text-2xl font-bold mb-4 text-center">
            Similar {type === "movie" ? "Movies" : "Shows"}
          </h3>
          <div className="flex justify-around flex-wrap">
            {similarItems.slice(0, 7).map((item) => (
              <div key={item.id} className="flex flex-col w-40 items-center mx-1">
                <img
                  src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                  alt={item.title || item.name}
                  className="rounded-lg h-60 w-full"
                  onError={(event) => {
                    event.currentTarget.src = noImage;
                  }}
                />
                <p className="text-sm max-w-40 p-2">{item.title || item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overlay;
