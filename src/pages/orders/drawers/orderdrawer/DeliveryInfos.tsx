import { Box, Button, Circle, Flex, Image, Text } from '@chakra-ui/react';
import { getConfig } from 'app/api/config';
import { useCourierProfilePicture } from 'app/api/courier/useCourierProfilePicture';
import { useOrderArrivalTimes } from 'app/api/order/useOrderArrivalTimes';
import { useOrderDeliveryRoute } from 'app/api/order/useOrderDeliveryRoute';
import { Order, WithId } from 'appjusto-types';
import { Marker } from 'common/components/MapsMarker';
import { Pendency } from 'common/components/Pendency';
import BlackPackageSvg from 'common/img/map-black-package.svg';
import BlackPointSvg from 'common/img/map-black-point.svg';
import GreenPointSvg from 'common/img/map-green-point.svg';
import UserSvg from 'common/img/map-user.svg';
import WhitePackageSvg from 'common/img/map-white-package.svg';
import { coordsFromLatLnt, SaoPauloCoords } from 'core/api/thirdparty/maps/utils';
import GoogleMapReact from 'google-map-react';
import I18n from 'i18n-js';
import React from 'react';
import { t } from 'utils/i18n';

interface DeliveryInfosProps {
  order: WithId<Order>;
  isCurrierArrived: boolean;
}

export const DeliveryInfos = ({ order, isCurrierArrived }: DeliveryInfosProps) => {
  // context
  const { googleMapsApiKey } = getConfig().api;
  const courierPictureUrl = useCourierProfilePicture(order.courier?.id);
  const arrivalTime = useOrderArrivalTimes(order);
  const route = useOrderDeliveryRoute(order);
  // state
  const [joined, setJoined] = React.useState<string | null>(null);
  const [courierIcon, setCourierIcon] = React.useState<string>(GreenPointSvg);
  const [restaurantIcon, setRestaurantIcon] = React.useState<string>(WhitePackageSvg);

  const isUnmatched = order.dispatchingState
    ? ['idle', 'matching', 'unmatched', 'no-match'].includes(order.dispatchingState)
    : true;

  // side effects
  React.useEffect(() => {
    if (order.status !== 'ready') {
      setCourierIcon(BlackPackageSvg);
      setRestaurantIcon(BlackPointSvg);
    }
  }, [order.status]);
  React.useEffect(() => {
    const date = order.courier?.joined as firebase.firestore.Timestamp;
    if (date) {
      try {
        const month = I18n.strftime(date.toDate(), '%B');
        const year = date.toDate().toString().split(' ')[3];
        const joinDate = `${month}, ${year}`;
        setJoined(joinDate);
      } catch (error) {
        console.log(error);
      }
    }
  }, [order.courier]);
  // UI
  return (
    <Box mt="6">
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontSize="xl" color="black">
          {isUnmatched
            ? t('Buscando entregador')
            : isCurrierArrived
            ? t('Entregador no local')
            : t('Entregador à caminho da retirada')}
        </Text>
        {!isCurrierArrived &&
          arrivalTime &&
          (arrivalTime > 0 ? (
            <Text fontSize="sm">
              {t(
                `Chega em aproximadamente ${
                  arrivalTime > 1 ? arrivalTime + ' minutos' : arrivalTime + ' minuto'
                }`
              )}
            </Text>
          ) : (
            <Text fontSize="sm">{t(`Chega em menos de 1 minuto`)}</Text>
          ))}
      </Flex>
      {!isUnmatched && (
        <Flex mt="4" justifyContent="space-between" alignItems="flex-end">
          <Flex alignItems="center" justifyContent="flex-end">
            <Box>
              {courierPictureUrl ? (
                <Image src={courierPictureUrl} width="48px" height="48px" borderRadius="24px" />
              ) : (
                <Circle size="48px" bg="gray.400" />
              )}
            </Box>
            <Flex ml="4" flexDir="column">
              <Text fontSize="xl" color="black">
                {order.courier?.name}
              </Text>
              <Text fontSize="sm">{t(`No appJusto desde ${joined}`)}</Text>
            </Flex>
          </Flex>
          <Button variant="outline" size="sm">
            {t('Abrir chat com o entregador')}
            <Pendency />
          </Button>
        </Flex>
      )}
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
      <Text mt="4" fontSize="xl" color="black">
        {t('Destino do pedido')}
      </Text>
      <Text fontSize="sm">{order.destination?.address.description}</Text>
    </Box>
  );
};
