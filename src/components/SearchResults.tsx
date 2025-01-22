import React from "react";
import noImage from "../assets/noImage.jpg";
import noResult from "../assets/no-result.png";
import { getFormattedDate, DataTypes } from "../modules/types_file";

interface SearchProptType {
  searchResults: DataTypes[];
}

const SearchResults: React.FC<SearchProptType> = ({ searchResults }) => {

  return (
    <>
      <div className="search-results">
        {searchResults.length > 0 ? (
          <div className="flex flex-wrap justify-around mt-4">
            {searchResults.map((item) => (
              <div
                key={item.id}
                className="text-neutral-300 flex items-center flex-col justify-center bg-slate-0 rounded-lg  pt-4 mt-4 w-64 h-[28rem] m-1 cursor-pointer scale-95 hover:scale-100 hover:shadow-[0px_1px_5px_1px_#ffea0076] duration-200"
              >
                {/*//! if image not found render a msg img not found */}
                <img
                  src={`https://image.tmdb.org/t/p/w200/${item.poster_path}`}
                  alt={item.title || item.name}
                  className="rounded-lg  border-0 w-60 hover:shadow-[0_-10px_12px_1px_#ffea0076]"
                  onError={(event) => {
                    event.currentTarget.src = noImage;
                  }}
                />

                <div className="flex flex-col justify-center items-center pb-4">
                  <p className="text-xl p-2 font-bold relative top-1 text-nowrap truncate-text">
                    {item.title || item.name}
                  </p>

                  <p className="text-sm text-gray-400">
                    {item.media_type.toLocaleUpperCase()}
                  </p>

                  <p className="text-sm text-gray-400">
                    {item.release_date
                      ? getFormattedDate(item.release_date)
                      : item.first_air_date
                      ? getFormattedDate(item.first_air_date)
                      : "Unknown"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center">
            <div className=" flex justify-center flex-col items-center">
              <img width={500} src={noResult} alt="No results found" />
              <h1 className="text-3xl text-yellow-50">No Results Found !</h1>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchResults;
