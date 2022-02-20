import { LatLng } from '@appjusto/types';
import { Coords } from './types';

export const coordsFromLatLnt = (latlng: LatLng): Coords => ({
  lat: latlng.latitude,
  lng: latlng.longitude,
});
export const SaoPauloCoords: LatLng = { latitude: -23.55, longitude: -46.63 };
