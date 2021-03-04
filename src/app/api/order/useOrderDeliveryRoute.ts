import { Order, WithId } from 'appjusto-types';
import React from 'react';
import polyline from '@mapbox/polyline';
import { getCoordinatesMidpoint } from 'utils/functions';

type ShortLatLng = {
  lat: number;
  lng: number;
};

type LatLng = {
  latitude: number;
  longitude: number;
};
export interface Route {
  center: ShortLatLng;
  origin: LatLng;
  destination: LatLng;
  courier: LatLng;
  polyline: ShortLatLng[];
}

export const useOrderDeliveryRoute = (order: WithId<Order>) => {
  // state
  const [route, setRoute] = React.useState<Route | null>(null);
  // side effects
  React.useEffect(() => {
    if (order && order.origin && order.destination && order.route) {
      const routePolyline = polyline.decode(order.route?.polyline).map((pair: number[]) => {
        return { lat: pair[0], lng: pair[1] } as ShortLatLng;
      });
      const routeCoords = {
        center: getCoordinatesMidpoint(
          {
            lat: order.origin.location?.latitude,
            lng: order.origin.location?.longitude,
          } as ShortLatLng,
          {
            lat: order.destination.location?.latitude,
            lng: order.destination.location?.longitude,
          } as ShortLatLng
        ),
        origin: {
          latitude: order.origin.location?.latitude,
          longitude: order.origin.location?.longitude,
        },
        destination: {
          latitude: order.destination.location?.latitude,
          longitude: order.destination.location?.longitude,
        },
        courier: {
          latitude: order.courier?.location.latitude,
          longitude: order.courier?.location.longitude,
        },
        polyline: routePolyline,
      };
      setRoute(routeCoords as Route);
    }
  }, [order?.origin, order?.destination, order?.route]);
  console.log(route);
  // result
  return route;
};
