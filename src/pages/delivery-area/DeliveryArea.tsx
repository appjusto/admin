import { BusinessAddress } from '@appjusto/types';
import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useCepAndGeocode } from 'app/api/business/useCepAndGeocode';
import { getConfig } from 'app/api/config';
import { useContextBusiness } from 'app/state/business/context';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import { CustomNumberInput as NumberInput } from 'common/components/form/input/CustomNumberInput';
import { CustomPatternInput as PatternInput } from 'common/components/form/input/pattern-input/CustomPatternInput';
import { cepFormatter, cepMask } from 'common/components/form/input/pattern-input/formatters';
import { numbersOnlyParser } from 'common/components/form/input/pattern-input/parsers';
import { Select } from 'common/components/form/select/Select';
import { coordsFromLatLnt, SaoPauloCoords } from 'core/api/thirdparty/maps/utils';
import { safeParseInt } from 'core/numbers';
import GoogleMapReact from 'google-map-react';
import { OnboardingProps } from 'pages/onboarding/types';
import PageFooter from 'pages/PageFooter';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';
import { Marker } from '../../common/components/MapsMarker';
import { getCitiesByState, IBGEResult, UF } from '../../utils/ApiIBGE';
import ufs from '../../utils/ufs';
import { BusinessAverageCookingTime } from './BusinessAverageCookingTime';

const DeliveryArea = ({ onboarding, redirect }: OnboardingProps) => {
  // context
  const { business } = useContextBusiness();
  const { googleMapsApiKey } = getConfig().api;
  // state
  const defaultRadius = 10; // 10km
  const [map, setMap] = React.useState<google.maps.Map>();
  const [range, setRange] = React.useState<google.maps.Circle>();
  const [cep, setCEP] = React.useState(business?.businessAddress?.cep ?? '');
  const [address, setAddress] = React.useState(business?.businessAddress?.address ?? '');
  const [number, setNumber] = React.useState(business?.businessAddress?.number ?? '');
  const [city, setCity] = React.useState(business?.businessAddress?.city ?? '');
  const [state, setState] = React.useState(business?.businessAddress?.state ?? '');
  const [neighborhood, setNeighborhood] = React.useState(
    business?.businessAddress?.neighborhood ?? ''
  );
  const [additional, setAdditional] = React.useState(business?.businessAddress?.additional ?? '');
  const [deliveryRange, setDeliveryRange] = React.useState(
    String(business?.deliveryRange ?? defaultRadius)
  );
  const [averageCookingTime, setAverageCookingTime] = React.useState(1800);
  const [cities, setCities] = React.useState<string[]>([]);
  // business profile
  const { updateBusinessProfile, updateResult: result } = useBusinessProfile(
    typeof onboarding === 'string'
  );
  const { isLoading, isSuccess } = result;
  // cep & geocoding
  const { cepResult, geocodingResult } = useCepAndGeocode(business?.businessAddress, {
    cep,
    address,
    number,
    neighborhood,
    city,
    state,
    additional,
  });
  const center = coordsFromLatLnt(geocodingResult ?? SaoPauloCoords);
  // refs
  const cepRef = React.useRef<HTMLInputElement>(null);
  const numberRef = React.useRef<HTMLInputElement>(null);
  // handlers
  const onSubmitHandler = async () => {
    let addressObj = {
      cep,
      address,
      number,
      city,
      state,
      neighborhood,
      additional,
    } as BusinessAddress;
    if (geocodingResult) addressObj.latlng = geocodingResult;
    await updateBusinessProfile({
      businessAddress: addressObj,
      deliveryRange: safeParseInt(deliveryRange, defaultRadius) * 1000,
      averageCookingTime: averageCookingTime,
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
      if (business.businessAddress?.address) setAddress(business.businessAddress.address);
      if (business.businessAddress?.number) setNumber(business.businessAddress.number);
      if (business.businessAddress?.city) setCity(business.businessAddress.city);
      if (business.businessAddress?.state) setState(business.businessAddress.state);
      if (business.businessAddress?.additional) setAdditional(business.businessAddress.additional);
      if (business.deliveryRange) setDeliveryRange(String(business.deliveryRange / 1000));
      if (business.averageCookingTime) setAverageCookingTime(business.averageCookingTime);
    }
  }, [business]);
  // after postal lookup, change focus to number input
  React.useEffect(() => {
    if (!cepResult || cepResult?.erro) return;
    const { logradouro, localidade, bairro, uf } = !cepResult
      ? { logradouro: null, localidade: null, bairro: null, uf: null }
      : cepResult;
    if (logradouro) setAddress(logradouro);
    if (localidade) setCity(localidade);
    if (bairro) setNeighborhood(bairro);
    if (uf) setState(uf);
    if (logradouro && localidade && uf) numberRef?.current?.focus();
  }, [cepResult]);
  React.useEffect(() => {
    setCities([]);
    if (!state) return;
    (async () => {
      const citiesList = await getCitiesByState(state as UF);
      setCities(citiesList?.map((cityInfo: IBGEResult) => cityInfo?.nome));
    })();
  }, [cepResult, state]);
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
            label={t('CEP *')}
            placeholder={t('CEP')}
            mask={cepMask}
            formatter={cepFormatter}
            parser={numbersOnlyParser}
            value={cep}
            onValueChange={(value) => setCEP(value)}
            validationLength={8}
          />
        </Flex>
        <Stack mt="4" spacing={4} direction="row">
          <Select
            mt="0"
            maxW={{ base: '90px', md: '110px' }}
            id="delivery-state"
            label="UF *"
            placeholder="UF"
            value={state}
            onChange={(ev) => setState(ev.target.value)}
          >
            {ufs.map((uf) => (
              <option key={uf.id} value={uf.sigla}>
                {uf.sigla}
              </option>
            ))}
          </Select>
          <Select
            mt="0"
            id="delivery-city"
            label={t('Cidade *')}
            placeholder={t('Sua cidade')}
            value={city}
            onChange={(ev) => setCity(ev.target.value)}
            isDisabled={cities.length === 0}
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Select>
        </Stack>
        <Input
          id="delivery-neighborhood"
          label={t('Bairro *')}
          placeholder={t('Seu bairro')}
          value={neighborhood}
          onChange={(ev) => setNeighborhood(ev.target.value)}
          isRequired
        />
        <Flex flexDir={{ base: 'column', md: 'row' }}>
          <Input
            isRequired
            id="delivery-address"
            flex={{ base: 1, md: 4 }}
            label={t('Endereço *')}
            placeholder={t('Seu endereço')}
            value={address}
            onChange={(ev) => setAddress(ev.target.value)}
          />
          <Input
            isRequired
            id="delivery-address-number"
            flex={1}
            ml={{ base: '0', md: '4' }}
            label={t('Número *')}
            ref={numberRef}
            placeholder={t('000')}
            value={number}
            onChange={(ev) => setNumber(ev.target.value)}
          />
        </Flex>
        <Input
          id="delivery-complement"
          label={t('Complemento')}
          placeholder={t('Seu complemento')}
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
            label={t('Raio/ km *')}
            value={deliveryRange}
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
              setDeliveryRange(ev.target.value)
            }
          />
        </Flex>
        {geocodingResult !== undefined && (
          <>
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
            {geocodingResult === null && (
              <Text mt="2" fontSize="sm" lineHeight="21px" color="red">
                {t('Não foi possível encontrar uma geolocalização para o endereço informado.')}
              </Text>
            )}
          </>
        )}
        <Text mt="12" fontSize="xl" lineHeight="26px" color="black">
          {t('Tempo médio de preparo dos pratos')}
        </Text>
        <Text mt="2" fontSize="sm" lineHeight="21px">
          {t(
            'Sabemos que isso pode variar por prato ou tipo de preparo, mas o tempo médio vai ajudar na disponibilidade de entregadores por região'
          )}
        </Text>
        <BusinessAverageCookingTime
          averageCookingTime={averageCookingTime}
          getAverageCookingTime={setAverageCookingTime}
          cookingTimeMode={business?.settings?.cookingTimeMode}
        />
        <PageFooter onboarding={onboarding} redirect={redirect} isLoading={isLoading} />
      </form>
    </Box>
  );
};

export default DeliveryArea;
