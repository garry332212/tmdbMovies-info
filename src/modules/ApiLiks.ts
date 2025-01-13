// todo Accessing the API key from the .env file
// export const apiKey = process.env.REACT_APP_API_KEY;

//*baseUrl and API KEY to get a working endpoint
//export const apiKey = "a2006311928939b35613c28405038c87";
export const apiKey = "6219dd30966f68fdf859cfd214d2a0ad";
export const baseUrl = "https://api.themoviedb.org/3";

//*Movies Endpoint to fetch information regarding selected option

 const popular = `${baseUrl}/movie/popular?api_key=${apiKey}`;
 const upcoming = `${baseUrl}/movie/upcoming?api_key=${apiKey}`;
 const now_playing = `${baseUrl}/movie/now_playing?api_key=${apiKey}`;
 const top_rated_movies = `${baseUrl}/movie/top_rated?api_key=${apiKey}`;
 

 //!this endpoint let search both movies/tvshows
 const search =`${baseUrl}/search/multi?query=&api_key=${apiKey}`;
 

 const generes = `${baseUrl}/genre/movie/list?api_key=${apiKey}`;
 const movieDetail = `${baseUrl}/movie/$movieId?api_key=${apiKey}`; //? Fetch detailed information about a specific movie
 const movieCredits = `${baseUrl}/movie/$movieId/credits?api_key=${apiKey}`; //? Retrieve the cast and crew for a specific movie.
 const movieImages = `${baseUrl}/movie/$movieId/images?api_key=${apiKey}`; //? Images of specific movies, like backdrops
 const movieClips = `${baseUrl}/movie/$movieId/videos?api_key=${apiKey}`; //? !Get movies trailers and related clips
 const similarMovies = `${baseUrl}/movie/$movieId/similar?api_key=${apiKey}`; //? Similiar movies
 const movieReviews = `${baseUrl}/movie/$movieId/reviews?api_key=${apiKey}`; //? 
 const searchMovies = `${baseUrl}/search/movie?api_key=${apiKey}&query=SEARCH_QUERY  //? Search for Movies=${apiKey}`; //? 

 //*Export All The API LINKS: 


//*TV SHOWS Endpoint :-
const popularShows = `${baseUrl}/tv/popular?api_key=${apiKey}`;
const trendingShows = `${baseUrl}/trending/tv/week?api_key=${apiKey}`;
const top_rated_shows = `${baseUrl}/tv/top_rated?api_key=${apiKey}`;
const airing_today = `${baseUrl}/tv/airing_today?api_key=${apiKey}`;
const detailsTv = `${baseUrl}/tv/tv_id?api_key=${apiKey}`;
const similarTv = `${baseUrl}/tv/tv_id/similar?api_key=${apiKey}`;

//tv/{tv_id}?api_key=YOUR_API_KEY //? Fetch detailed information about a specific TV show


export {generes,popular,now_playing,movieDetail,upcoming, top_rated_movies,movieCredits,movieImages,movieClips,similarMovies,movieReviews,searchMovies,search}

export {popularShows,trendingShows,top_rated_shows,airing_today, detailsTv,similarTv}

/* //!Endpoints to work with TV SHOWS
 export const popularShows = "https://api.themoviedb.org/3/tv/popular"; //? Popular shows
/genre/tv/list?api_key=YOUR_API_KEY //? tv shows generes
/tv/{tv_id}/reviews?api_key=YOUR_API_KEY //? Retrieve reviews for a specific TV show.
/tv/{tv_id}/images?api_key=YOUR_API_KEY //? tv show images
/tv/{tv_id}?api_key=YOUR_API_KEY //? Fetch detailed information about a specific TV show

/tv/{tv_id}/similar?api_key=YOUR_API_KEY
/tv/{tv_id}/season/{season_number}?api_key=YOUR_API_KEY //? seasons of the show
/trending/tv/week?api_key=YOUR_API_KEY
/search/tv?api_key=YOUR_API_KEY&query=SEARCH_QUERY //? Search for tv shows
/genre/tv/list?api_key=YOUR_API_KEY
/tv/popular?api_key=YOUR_API_KEY




Get TV Show Videos (Trailers, Clips)

Endpoint: /tv/{tv_id}/videos
Description: Fetch videos related to a TV show (e.g., trailers, clips).
Example:
http
Copy code
GET /tv/{tv_id}/videos?api_key=YOUR_API_KEY

*/


