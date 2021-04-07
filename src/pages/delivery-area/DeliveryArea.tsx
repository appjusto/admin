import { Box, Flex, Text } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { getConfig } from 'app/api/config';
import { useContextApi } from 'app/state/api/context';
import { useContextBusiness } from 'app/state/business/context';
import { AlertError } from 'common/components/AlertError';
import { AlertSuccess } from 'common/components/AlertSuccess';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import { CustomNumberInput as NumberInput } from 'common/components/form/input/CustomNumberInput';
import { CustomPatternInput as PatternInput } from 'common/components/form/input/pattern-input/CustomPatternInput';
import { cepFormatter, cepMask } from 'common/components/form/input/pattern-input/formatters';
import { numbersOnlyParser } from 'common/components/form/input/pattern-input/parsers';
import { coordsFromLatLnt, SaoPauloCoords } from 'core/api/thirdparty/maps/utils';
import { fetchCEPInfo } from 'core/api/thirdparty/viacep';
import { safeParseInt } from 'core/numbers';
import GoogleMapReact from 'google-map-react';
import { nanoid } from 'nanoid';
import { OnboardingProps } from 'pages/onboarding/types';
import PageFooter from 'pages/PageFooter';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { useQuery } from 'react-query';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';
import { Marker } from '../../common/components/MapsMarker';

const DeliveryArea = ({ onboarding, redirect }: OnboardingProps) => {
  // context
  const api = useContextApi();
  const { business } = useContextBusiness();
  const { googleMapsApiKey } = getConfig().api;

  // state
  const defaultRadius = 10; // 10km
  const [autocompleteSession] = React.useState(nanoid());
  const [map, setMap] = React.useState<google.maps.Map>();
  const [range, setRange] = React.useState<google.maps.Circle>();
  const [cep, setCEP] = React.useState(business?.businessAddress?.cep ?? '');
  const [number, setNumber] = React.useState(business?.businessAddress?.number ?? '');
  const [additional, setAdditional] = React.useState(business?.businessAddress?.additional ?? '');
  const [deliveryRange, setDeliveryRange] = React.useState(
    String(business?.deliveryRange ?? defaultRadius)
  );

  // queries & mutations
  // business profile
  const { updateBusinessProfile, result } = useBusinessProfile();
  const { isLoading, isSuccess, isError } = result;
  // cep
  const { data: cepResult } = useQuery(['cep', cep], (_: string) => fetchCEPInfo(cep), {
    enabled: cep.length === 8,
  });
  const { logradouro, localidade, uf } =
    !cepResult || cepResult.error ? { logradouro: '', localidade: '', uf: '' } : cepResult;
  // geocoding
  const geocode = (_: string, street: string, number: string, city: string, state: string) =>
    api.maps().googleGeocode(`${street}, ${number} - ${city} - ${state}`, autocompleteSession);
  const { data: geocodingResult } = useQuery(
    ['geocoding', logradouro, number, localidade, uf],
    geocode,
    {
      enabled: logradouro?.length > 0 && number.length > 0,
    }
  );
  const center = coordsFromLatLnt(geocodingResult ?? SaoPauloCoords);

  // refs
  const cepRef = React.useRef<HTMLInputElement>(null);
  const numberRef = React.useRef<HTMLInputElement>(null);

  // handlers
  const onSubmitHandler = async () => {
    await updateBusinessProfile({
      businessAddress: {
        cep,
        address: logradouro,
        number,
        city: localidade,
        state: uf,
        additional,
        latlng: geocodingResult,
      },
      deliveryRange: safeParseInt(deliveryRange, defaultRadius) * 1000,
    });
  };

  // side effects
  // initial focus
  React.useEffect(() => {
    if (onboarding) window?.scrollTo(0, 0);
    cepRef?.current?.focus();
  }, [onboarding]);
  // fill fields after initial load
  React.useEffect(() => {
    if (business) {
      if (business.businessAddress?.cep) setCEP(business.businessAddress.cep);
      if (business.businessAddress?.number) setNumber(business.businessAddress.number);
      if (business.businessAddress?.additional) setAdditional(business.businessAddress.additional);
      if (business.deliveryRange) setDeliveryRange(String(business.deliveryRange / 1000));
    }
  }, [business]);
  // after postal lookup, change focus to number input
  React.useEffect(() => {
    if (cepResult) numberRef?.current?.focus();
  }, [cepResult]);
  // updating range
  React.useEffect(() => {
    if (map && range) {
      range.setMap(map);
    }
  }, [map, range]);
  React.useEffect(() => {
    if (range && center) {
      range.setCenter(center);
    }
  }, [center, range]);
  React.useEffect(() => {
    const radius = safeParseInt(deliveryRange, defaultRadius) * 1000;
    if (range) {
      range.setRadius(radius);
    }
  }, [range, deliveryRange]);

  // UI
  if (isSuccess && redirect) return <Redirect to={redirect} push />;
  return (
    <Box maxW="756px">
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          onSubmitHandler();
        }}
      >
        <PageHeader
          title={t('Endereço do restaurante')}
          subtitle={t('O raio de entrega é calculado a partir do endereço do seu restaurante')}
        />
        <Flex flexGrow={0}>
          <PatternInput
            isRequired
            ref={cepRef}
            id="delivery-postalcode"
            label={t('CEP')}
            placeholder={t('CEP')}
            mask={cepMask}
            formatter={cepFormatter}
            parser={numbersOnlyParser}
            value={cep}
            onValueChange={(value) => setCEP(value)}
            validationLength={8}
          />
        </Flex>
        <Flex flexDir={{ base: 'column', md: 'row' }}>
          <Input
            isRequired
            id="delivery-address"
            flex={{ base: 1, md: 4 }}
            label={t('Endereço')}
            placeholder={t('Preenchimento automático')}
            value={logradouro}
            isReadOnly
          />
          <Input
            isRequired
            id="delivery-address-number"
            flex={1}
            ml={{ base: '0', md: '4' }}
            label={t('Número')}
            ref={numberRef}
            placeholder={t('000')}
            value={number}
            onChange={(ev) => setNumber(ev.target.value)}
          />
        </Flex>
        <Input
          id="delivery-complement"
          label={t('Complemento')}
          placeholder={t('Sem complemento')}
          value={additional}
          onChange={(ev) => setAdditional(ev.target.value)}
        />
        <Text mt="8" fontSize="xl" color="black">
          {t('Raio de entrega')}
        </Text>
        <Text mt="2" fontSize="sm">
          {t('Determine o raio da área de entrega em quilômetros (km)')}
        </Text>
        <Flex flexGrow={0}>
          <NumberInput
            isRequired
            id="delivery-ray"
            maxW="100px"
            label={t('Raio/ km')}
            value={deliveryRange}
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
              setDeliveryRange(ev.target.value)
            }
          />
        </Flex>
        <Box
          mt="6"
          w={{ base: '328px', md: '380px', lg: onboarding ? '536px' : '756px' }}
          h={{ base: '240px', md: '260px', lg: onboarding ? '380px' : '420px' }}
        >
          <GoogleMapReact
            bootstrapURLKeys={{ key: googleMapsApiKey }}
            defaultCenter={coordsFromLatLnt(SaoPauloCoords)}
            center={center}
            defaultZoom={onboarding ? 12 : 13}
            onGoogleApiLoaded={({ map }) => {
              setRange(
                new google.maps.Circle({
                  strokeColor: '#FFFFFF',
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: '#78E08F',
                  fillOpacity: 0.5,
                })
              );
              setMap(map);
            }}
            yesIWantToUseGoogleMapApiInternals
          >
            <Marker lat={center.lat} lng={center.lng} />
          </GoogleMapReact>
        </Box>
        <PageFooter onboarding={onboarding} redirect={redirect} isLoading={isLoading} />
        {!onboarding && isSuccess && (
          <AlertSuccess
            maxW="320px"
            title={t('Informações salvas com sucesso!')}
            description={''}
          />
        )}
        {isError && (
          <AlertError
            w="100%"
            title={t('Erro')}
            description={'Não foi possível acessar o servidor. Tenta novamente?'}
          />
        )}
      </form>
    </Box>
  );
};

export default DeliveryArea;
