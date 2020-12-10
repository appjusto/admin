import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { getConfig } from 'app/api/config';
import { useContextBusiness } from 'app/state/business/context';
import { Input } from 'common/components/form/input/Input';
import { NumberInput } from 'common/components/form/input/NumberInput';
import { cepFormatter, cepMask } from 'common/components/form/input/pattern-input/formatters';
import { numbersOnlyParser } from 'common/components/form/input/pattern-input/parsers';
import { PatternInput } from 'common/components/form/input/pattern-input/PatternInput';
import { fetchCEPInfo } from 'core/api/thirdparty/viacep';
import GoogleMapReact from 'google-map-react';
import React from 'react';
import { useQuery } from 'react-query';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';

interface Props {
  redirect: string;
}

export const DeliveryArea = ({ redirect }: Props) => {
  // context
  const business = useContextBusiness();
  const { googleMapsApiKey } = getConfig();

  // state
  const [cep, setCEP] = React.useState(business?.businessAddress?.cep ?? '');
  const [number, setNumber] = React.useState(business?.businessAddress?.number ?? '');
  const [additional, setAdditional] = React.useState(business?.businessAddress?.additional ?? '');
  const [deliveryRange, setDeliveryRange] = React.useState(business?.deliveryRange ?? 15);

  // queries & mutations
  const { updateBusinessProfile, result } = useBusinessProfile();
  const { isLoading, isSuccess } = result;
  const fetchCEP = (key: string) => fetchCEPInfo(cep);
  const { data: cepInfo } = useQuery(['cep', cep], fetchCEP, { enabled: cep.length === 8 });
  const { logradouro, localidade, uf } =
    !cepInfo || cepInfo.error ? { logradouro: '', localidade: '', uf: '' } : cepInfo;

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
    if (business?.businessAddress) {
      if (business.businessAddress.cep) setCEP(business.businessAddress.cep);
      if (business.businessAddress.number) setCEP(business.businessAddress.number);
      if (business.businessAddress.additional) setCEP(business.businessAddress.additional);
    }
  }, [business]);
  // cep lookup
  React.useEffect(() => {
    if (cep.length === 8) console.log(cep);
  }, [cep]);
  // after postal lookup, change focus to number input
  React.useEffect(() => {
    if (cepInfo) numberRef?.current?.focus();
  }, [cepInfo]);
  // google maps geocoding
  React.useEffect(() => {}, [number]);

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
      deliveryRange,
    });
  };

  // UI
  if (isSuccess) return <Redirect to={redirect} push />;
  return (
    <Box w="656px">
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          onSubmitHandler();
        }}
      >
        <Text fontSize="xl" color="black">
          {t('Área de entrega')}
        </Text>
        <Text mt="2" fontSize="sm">
          {t('O raio de entrega é calculado a partir do endereço determinado')}
        </Text>
        <Flex flexGrow={0}>
          <PatternInput
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
            onChange={(value) => setDeliveryRange(parseInt(value))}
          />
        </Flex>
        <Box mt="6" w="656px" h="480px">
          <GoogleMapReact
            bootstrapURLKeys={{ key: googleMapsApiKey }}
            defaultCenter={{ lat: 59.95, lng: 30.33 }}
            defaultZoom={11}
          />
        </Box>
        <Button mt="4" size="lg" onClick={onSubmitHandler} isLoading={isLoading}>
          {t('Salvar e continuar')}
        </Button>
      </form>
    </Box>
  );
};
