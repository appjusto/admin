import { Box } from '@chakra-ui/react';
import { getConfig } from 'app/api/config';
import { useOrderDeliveryRoute } from 'app/api/order/useOrderDeliveryRoute';
import { Order, WithId } from 'appjusto-types';
import { Marker } from 'common/components/MapsMarker';
import BlackPackageSvg from 'common/img/map-black-package.svg';
import BlackPointSvg from 'common/img/map-black-point.svg';
import GreenPointSvg from 'common/img/map-green-point.svg';
import UserSvg from 'common/img/map-user.svg';
import WhitePackageSvg from 'common/img/map-white-package.svg';
import { coordsFromLatLnt, SaoPauloCoords } from 'core/api/thirdparty/maps/utils';
import GoogleMapReact from 'google-map-react';
import React from 'react';

interface DeliveryMapProps {
  order?: WithId<Order> | null;
}

export const DeliveryMap = ({ order }: DeliveryMapProps) => {
  // context
  const { googleMapsApiKey } = getConfig().api;
  const route = useOrderDeliveryRoute(order);
  // state
  const [courierIcon, setCourierIcon] = React.useState<string>(GreenPointSvg);
  const [restaurantIcon, setRestaurantIcon] = React.useState<string>(WhitePackageSvg);

  // side effects
  React.useEffect(() => {
    if (order?.status !== 'ready') {
      setCourierIcon(BlackPackageSvg);
      setRestaurantIcon(BlackPointSvg);
    }
  }, [order?.status]);

  // UI
  return (
    <Box
      mt="6"
      w={{ base: '328px', md: '380px', lg: '607px' }}
      h={{ base: '240px', md: '260px', lg: '380px' }}
      bg="gray.500"
    >
      {route && (
        <GoogleMapReact
          bootstrapURLKeys={{ key: googleMapsApiKey }}
          defaultCenter={coordsFromLatLnt(SaoPauloCoords)}
          center={route.center}
          defaultZoom={14}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => {
            map.data.add({
              geometry: new maps.Data.LineString(route.polyline),
            });
          }}
        >
          <Marker
            key={Math.random()}
            icon={restaurantIcon}
            lat={route.origin.latitude}
            lng={route.origin.longitude}
            mt="-10px"
          />
          <Marker
            key={Math.random()}
            icon={UserSvg}
            lat={route.destination.latitude}
            lng={route.destination.longitude}
            h="44px"
            w="38px"
            mt="-44px"
            ml="-16px"
          />
          <Marker
            key={Math.random()}
            icon={courierIcon}
            lat={route.courier.latitude}
            lng={route.courier.longitude}
            h="36px"
            w="30px"
            mt="-38px"
            ml="-15px"
          />
        </GoogleMapReact>
      )}
    </Box>
  );
};
