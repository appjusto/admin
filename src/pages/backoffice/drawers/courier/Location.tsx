import { Box, Flex, Text } from '@chakra-ui/react';
import { getConfig } from 'app/api/config';
import { useContextCourierProfile } from 'app/state/courier/context';
import { CustomButton } from 'common/components/buttons/CustomButton';
import GreenPointSvg from 'common/img/map-green-point.svg';
import { coordsFromLatLnt, SaoPauloCoords } from 'core/api/thirdparty/maps/utils';
import firebase from 'firebase';
import GoogleMapReact from 'google-map-react';
import React from 'react';
import { t } from 'utils/i18n';
import { courierLocationStatusPTOptions } from '../../utils/index';
import { SectionTitle } from '../generics/SectionTitle';

interface CourierLocationMapProps {
  coordinates: firebase.firestore.GeoPoint;
}

const CourierLocationMap = ({ coordinates }: CourierLocationMapProps) => {
  // context
  const { googleMapsApiKey } = getConfig().api;
  // helpers
  const center = { lat: coordinates.latitude, lng: coordinates.longitude };
  // handlers
  //@ts-ignore
  const renderMarkers = (map, maps) => {
    let marker = new maps.Marker({
      position: { lat: coordinates.latitude, lng: coordinates.longitude },
      map,
      title: 'Entregador!',
      icon: GreenPointSvg,
    });
    return marker;
  };
  return (
    <Box
      mt="6"
      w={{ base: '328px', md: '380px', lg: '607px' }}
      h={{ base: '240px', md: '260px', lg: '380px' }}
      bg="gray.500"
    >
      <GoogleMapReact
        bootstrapURLKeys={{ key: googleMapsApiKey }}
        defaultCenter={coordsFromLatLnt(SaoPauloCoords)}
        center={center}
        defaultZoom={14}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
      >
        {/*<Marker
          key={Math.random()}
          icon={GreenPointSvg}
          lat={coordinates.latitude}
          lng={coordinates.longitude}
          mt="-10px"
        />*/}
      </GoogleMapReact>
    </Box>
  );
};

export const Location = () => {
  // context
  const { courier } = useContextCourierProfile();
  // state
  const [googleLink, setGoogleLink] = React.useState<string>();
  // side effects
  React.useEffect(() => {
    if (!courier?.coordinates || courier?.status === 'unavailable') return;
    const link = `https://www.google.com/maps/search/?api=1&query=${courier.coordinates.latitude}%2C${courier.coordinates.longitude}`;
    setGoogleLink(link);
  }, [courier?.coordinates, courier?.status]);
  //UI
  return (
    <Box>
      <SectionTitle>{t('Localização do entregador')}</SectionTitle>
      <Flex justifyContent="space-between" alignItems="flex-end">
        <Text fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
          {t('Status da localização:')}{' '}
          <Text as="span" fontWeight="500">
            {courier?.status ? courierLocationStatusPTOptions[courier.status] : 'N/E'}
          </Text>
        </Text>
        <CustomButton
          size="sm"
          variant="outline"
          w="160px"
          h="32px"
          label={t('Ver no Google')}
          link={googleLink}
          isExternal
          isDisabled={!googleLink}
          _focus={{ outline: 'none' }}
        />
      </Flex>
      {courier?.status !== 'unavailable' && courier?.coordinates && (
        <CourierLocationMap coordinates={courier.coordinates} />
      )}
    </Box>
  );
};
