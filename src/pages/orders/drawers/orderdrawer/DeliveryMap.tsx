import { LatLng, OrderStatus } from '@appjusto/types';
import { Box, Flex, Spinner } from '@chakra-ui/react';
import { getConfig } from 'app/api/config';
import { useOrderDeliveryRoute } from 'app/api/order/useOrderDeliveryRoute';
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
  orderStatus?: OrderStatus;
  origin?: LatLng;
  destination?: LatLng;
  courier?: LatLng;
  orderPolyline?: string;
}

export const DeliveryMap = React.memo(
  ({ orderStatus, origin, destination, courier, orderPolyline }: DeliveryMapProps) => {
    // context
    const { googleMapsApiKey } = getConfig().api;
    const route = useOrderDeliveryRoute(origin, destination, courier, orderPolyline);
    // state
    const [courierIcon, setCourierIcon] = React.useState<string>(GreenPointSvg);
    const [restaurantIcon, setRestaurantIcon] = React.useState<string>(WhitePackageSvg);
    // handlers
    //@ts-ignore
    const renderMarkers = (map, maps) => {
      if (!route?.origin.latitude || !route?.destination.latitude) return;
      let business = new maps.Marker({
        position: { lat: route.origin.latitude, lng: route.origin.longitude },
        map,
        title: 'Restaurante',
        icon: restaurantIcon,
      });
      let consumer = new maps.Marker({
        position: { lat: route.destination.latitude, lng: route.destination.longitude },
        map,
        title: 'Cliente',
        icon: UserSvg,
      });
      return { business, consumer };
    };
    // side effects
    React.useEffect(() => {
      if (orderStatus !== 'ready') {
        setCourierIcon(BlackPackageSvg);
        setRestaurantIcon(BlackPointSvg);
      }
    }, [orderStatus]);
    // UI
    if (!route) {
      return (
        <Flex
          mt="6"
          w={{ base: '328px', md: '380px', lg: '607px' }}
          h={{ base: '240px', md: '260px', lg: '380px' }}
          bg="gray.500"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner size="sm" />
        </Flex>
      );
    }
    if (route?.courier?.latitude && route?.courier?.longitude) {
      return (
        <Box
          mt="6"
          w={{ base: '328px', md: '380px', lg: '607px' }}
          h={{ base: '240px', md: '260px', lg: '380px' }}
          bg="gray.500"
        >
          <GoogleMapReact
            key={origin?.latitude}
            bootstrapURLKeys={{ key: googleMapsApiKey }}
            defaultCenter={coordsFromLatLnt(SaoPauloCoords)}
            center={route.center}
            defaultZoom={14}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => {
              map.data.add({
                geometry: new maps.Data.LineString(route.polyline),
              });
              renderMarkers(map, maps);
            }}
          >
            <Marker
              key={route.courier.latitude}
              icon={courierIcon}
              lat={route.courier.latitude}
              lng={route.courier.longitude}
              h="36px"
              w="30px"
              mt="-38px"
              ml="-15px"
            />
          </GoogleMapReact>
        </Box>
      );
    }
    return (
      <Box
        mt="6"
        w={{ base: '328px', md: '380px', lg: '607px' }}
        h={{ base: '240px', md: '260px', lg: '380px' }}
        bg="gray.500"
      >
        <GoogleMapReact
          key={origin?.latitude}
          bootstrapURLKeys={{ key: googleMapsApiKey }}
          defaultCenter={coordsFromLatLnt(SaoPauloCoords)}
          center={route.center}
          defaultZoom={14}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => {
            map.data.add({
              geometry: new maps.Data.LineString(route.polyline),
            });
            renderMarkers(map, maps);
          }}
        ></GoogleMapReact>
      </Box>
    );
  }
);
