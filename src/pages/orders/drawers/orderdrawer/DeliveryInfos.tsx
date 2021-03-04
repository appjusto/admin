import { Box, Button, Circle, Flex, Image, Text } from '@chakra-ui/react';
import { getConfig } from 'app/api/config';
import { useCourierProfilePicture } from 'app/api/courier/useCourierProfilePicture';
import { useOrderArrivalTimes } from 'app/api/order/useOrderArrivalTimes';
import { Order, WithId } from 'appjusto-types';
import { coordsFromLatLnt, SaoPauloCoords } from 'core/api/thirdparty/maps/utils';
import GoogleMapReact from 'google-map-react';
import I18n from 'i18n-js';
import React from 'react';
import { t } from 'utils/i18n';
import { Pendency } from '.';
interface DeliveryInfosProps {
  order: WithId<Order>;
}

export const DeliveryInfos = ({ order }: DeliveryInfosProps) => {
  // context
  const courierPictureUrl = useCourierProfilePicture(order.courier?.id);
  const arrivalTime = useOrderArrivalTimes(order);
  // state
  const [joined, setJoined] = React.useState<string | null>(null);

  const { googleMapsApiKey } = getConfig().api;
  const center = { lat: -8.0623939, lng: -34.8728223 };
  const isCurrierArrived = order.dispatchingState === 'arrived-pickup';

  // side effects
  React.useEffect(() => {
    const date = order.courier?.joined as firebase.firestore.Timestamp;
    if (date) {
      const month = I18n.strftime(date.toDate(), '%B');
      const year = date.toDate().toString().split(' ')[3];
      const joinDate = `${month}, ${year}`;
      setJoined(joinDate);
    }
  }, [order.courier]);

  // UI
  return (
    <Box mt="6">
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontSize="xl" color="black">
          {isCurrierArrived ? t('Entregador no local') : t('Entregador à caminho da retirada')}
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
      <Box
        mt="6"
        w={{ base: '328px', md: '380px', lg: '607px' }}
        h={{ base: '240px', md: '260px', lg: '380px' }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{ key: googleMapsApiKey }}
          defaultCenter={coordsFromLatLnt(SaoPauloCoords)}
          center={center}
          defaultZoom={18}
          yesIWantToUseGoogleMapApiInternals
        >
          {/*<Marker lat={center.lat} lng={center.lng} />*/}
        </GoogleMapReact>
      </Box>
      <Text mt="4" fontSize="xl" color="black">
        {t('Destino do pedido')}
      </Text>
      <Text fontSize="sm">{order.destination?.address.description}</Text>
    </Box>
  );
};
