export interface Coords {
  lat: number;
  lng: number;
}

export type GooglePlacesAddressResult = {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  terms: { value: string }[];
};

export type GooglePlacesPredictionsResult = {
  predictions: GooglePlacesAddressResult[];
};

export type AutoCompleteResult = {
  description: string;
  placeId?: string;
  main: string;
  secondary: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
};