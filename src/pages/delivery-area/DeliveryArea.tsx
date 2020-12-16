import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { getConfig } from 'app/api/config';
import { useApi } from 'app/state/api/context';
import { useContextBusiness } from 'app/state/business/context';
import { Input } from 'common/components/form/input/Input';
import { NumberInput } from 'common/components/form/input/NumberInput';
import { cepFormatter, cepMask } from 'common/components/form/input/pattern-input/formatters';
import { numbersOnlyParser } from 'common/components/form/input/pattern-input/parsers';
import { PatternInput } from 'common/components/form/input/pattern-input/PatternInput';
import { coordsFromLatLnt, SaoPauloCoords } from 'core/api/thirdparty/maps/utils';
import { fetchCEPInfo } from 'core/api/thirdparty/viacep';
import { safeParseInt } from 'core/numbers';
import GoogleMapReact from 'google-map-react';
import { nanoid } from 'nanoid';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { useQuery } from 'react-query';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';

interface Props {
  redirect: string;
}

export const DeliveryArea = ({ redirect }: Props) => {
  // context
  const api = useApi();
  const business = useContextBusiness();
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
  const { isLoading, isSuccess } = result;
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
      enabled: logradouro.length > 0 && number.length > 0,
    }
  );
  const center = coordsFromLatLnt(geocodingResult ?? SaoPauloCoords);

  // refs
  const cepRef = React.useRef<HTMLInputElement>(null);
  const numberRef = React.useRef<HTMLInputElement>(null);

  // side effects
  // initial focus
  React.useEffect(() => {
    cepRef?.current?.focus();
  }, []);
  // fill fields after initial load
  React.useEffect(() => {
    if (business) {
      if (business.businessAddress?.cep) setCEP(business.businessAddress.cep);
      if (business.businessAddress?.number) setNumber(business.businessAddress.number);
      if (business.businessAddress?.additional) setAdditional(business.businessAddress.additional);
      if (business.deliveryRange) setDeliveryRange(String(business.deliveryRange));
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
      },
      deliveryRange: safeParseInt(deliveryRange, defaultRadius),
    });
  };

  // UI
  if (isSuccess) return <Redirect to={redirect} push />;
  return (
    <>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          onSubmitHandler();
        }}
      >
        <PageHeader
          title={t('Área de entrega')}
          subtitle={t('O raio de entrega é calculado a partir do endereço determinado')}
        />

        <Flex flexGrow={0}>
          <PatternInput
            ref={cepRef}
            mt="4"
            label={t('CEP')}
            placeholder={t('CEP')}
            mask={cepMask}
            formatter={cepFormatter}
            parser={numbersOnlyParser}
            value={cep}
            onValueChange={(value) => setCEP(value)}
          />
        </Flex>
        <Flex mt="4">
          <Input
            flex={4}
            label={t('Endereço')}
            placeholder={t('Preenchimento automático')}
            value={logradouro}
            isReadOnly
          />
          <Input
            flex={1}
            ml="4"
            label={t('Número')}
            ref={numberRef}
            placeholder={t('000')}
            value={number}
            onChange={(ev) => setNumber(ev.target.value)}
          />
          <Input
            flex={2}
            ml="4"
            label={t('Complemento')}
            placeholder={t('Sem complemento')}
            value={additional}
            onChange={(ev) => setAdditional(ev.target.value)}
          />
        </Flex>
        <Text mt="8" fontSize="xl" color="black">
          {t('Raio de entrega')}
        </Text>
        <Text mt="2" fontSize="sm">
          {t('Determine o raio da área de entrega em quilômetros (km)')}
        </Text>
        <Flex flexGrow={0}>
          <NumberInput
            mt="6"
            label={t('Raio/ km')}
            value={deliveryRange}
            onChange={(value) => setDeliveryRange(value)}
          />
        </Flex>
        <Box
          mt="6"
          w={['164px', '246px', '328px', '410px', '574px', '656px']}
          h={['120px', '180px', '240px', '300px', '420px', '480px']}
        >
          <GoogleMapReact
            bootstrapURLKeys={{ key: googleMapsApiKey }}
            defaultCenter={coordsFromLatLnt(SaoPauloCoords)}
            center={center}
            defaultZoom={12}
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
            {/* <Range /> */}
          </GoogleMapReact>
        </Box>
        <Button mt="4" size="lg" onClick={onSubmitHandler} isLoading={isLoading}>
          {t('Salvar e continuar')}
        </Button>
      </form>
    </>
  );
};
