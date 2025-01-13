
export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
  name: string;
  backdrop_path:string;
  media_type:string
 release_date:string
 first_air_date:string
}


export interface TVShow {

  poster_path: string | null;
  overview: string;
  vote_average: number;
}

export interface ItemsCategory {
  apiEndpoint: string;
  itemHeading: string;

}

//* helper function to get the categories :- will be used in HOME.TSX/mOVIE/TVSHOW
export const createDisplayItems = (
  apiEndpoint: string,
  itemHeading: string,

): ItemsCategory => ({
  apiEndpoint: `${apiEndpoint}`,
  itemHeading,
});


