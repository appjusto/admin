import { Box, Circle, Flex, Text } from '@chakra-ui/react';
import { getConfig } from 'app/api/config';
import { coordsFromLatLnt, SaoPauloCoords } from 'core/api/thirdparty/maps/utils';
import GoogleMapReact from 'google-map-react';
import { t } from 'utils/i18n';

export const DeliveryInfos = () => {
  const { googleMapsApiKey } = getConfig().api;
  const center = { lat: -8.0623939, lng: -34.8728223 };
  return (
    <Box mt="6">
      <Flex justifyContent="space-between">
        <Flex flexDir="column">
          <Text fontSize="xl" color="black">
            {t('Entregador à caminho da retirada')}
          </Text>
          <Text fontSize="sm">{t('Chega em aproximadamente 10 minutos')}</Text>
        </Flex>
        <Flex alignItems="center" justifyContent="flex-end">
          <Box>
            <Circle size="48px" bg="gray.400" />
          </Box>
          <Flex ml="4" flexDir="column">
            <Text fontSize="xl" color="black">
              {t('João Paulo')}
            </Text>
            <Text fontSize="sm">{t('No appJusto desde Setembro, 2020')}</Text>
          </Flex>
        </Flex>
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
      <Text fontSize="sm">{t('Marco zero - Bairro do Recife, Recife, Pernambuco.')}</Text>
    </Box>
  );
};
