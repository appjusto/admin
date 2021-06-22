import React from 'react';
import polyline from '@mapbox/polyline';
import { getCoordinatesMidpoint } from 'utils/functions';
import { LatLng } from 'appjusto-types';

type ShortLatLng = {
  lat: number;
  lng: number;
};
export interface Route {
  center: ShortLatLng;
  origin: LatLng;
  destination: LatLng;
  courier: LatLng;
  polyline: ShortLatLng[];
}

export const useOrderDeliveryRoute = (
  origin?: LatLng,
  destination?: LatLng,
  courier?: LatLng,
  orderPolyline?: string
) => {
  // state
  const [route, setRoute] = React.useState<Route | null>(null);
  // side effects
  React.useEffect(() => {
    if (origin && destination && orderPolyline) {
      const routePolyline = polyline.decode(orderPolyline).map((pair: number[]) => {
        return { lat: pair[0], lng: pair[1] } as ShortLatLng;
      });
      const routeCoords = {
        center: getCoordinatesMidpoint(
          {
            lat: origin?.latitude,
            lng: origin?.longitude,
          } as ShortLatLng,
          {
            lat: destination?.latitude,
            lng: destination?.longitude,
          } as ShortLatLng
        ),
        origin: {
          latitude: origin?.latitude,
          longitude: origin?.longitude,
        },
        destination: {
          latitude: destination?.latitude,
          longitude: destination?.longitude,
        },
        courier: {
          latitude: courier?.latitude,
          longitude: courier?.longitude,
        },
        polyline: routePolyline,
      };
      setRoute(routeCoords as Route);
    }
  }, [origin, destination, courier, orderPolyline]);
  // result
  return route;
};
