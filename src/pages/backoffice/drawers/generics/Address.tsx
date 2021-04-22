import { Box, Button, Flex, HStack } from '@chakra-ui/react';
import { GenericAddress } from 'appjusto-types';
import { AlertError } from 'common/components/AlertError';
import { AlertSuccess } from 'common/components/AlertSuccess';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import { CustomPatternInput as PatternInput } from 'common/components/form/input/pattern-input/CustomPatternInput';
import { cepFormatter, cepMask } from 'common/components/form/input/pattern-input/formatters';
import { numbersOnlyParser } from 'common/components/form/input/pattern-input/parsers';
import React from 'react';
import { t } from 'utils/i18n';
import { Result, UpdateProfile } from './types';

interface AddressProps {
  address: GenericAddress | undefined;
  updateProfile: UpdateProfile;
  result: Result;
}

export const Address = ({ address, updateProfile, result }: AddressProps) => {
  // context
  const { isLoading, isSuccess, isError } = result;

  // state
  const [cep, setCEP] = React.useState(address?.cep ?? '');
  const [street, setStreet] = React.useState(address?.address ?? '');
  const [number, setNumber] = React.useState(address?.number ?? '');
  const [additional, setAdditional] = React.useState(address?.additional ?? '');
  const [city, setCity] = React.useState(address?.city ?? '');
  const [state, setState] = React.useState(address?.state ?? '');

  // refs
  const cepRef = React.useRef<HTMLInputElement>(null);
  const numberRef = React.useRef<HTMLInputElement>(null);

  // handlers
  const onSubmitHandler = async () => {
    await updateProfile({
      userAddress: {
        cep,
        address: street,
        number,
        city,
        state,
        additional,
      },
    });
  };

  // side effects
  // initial focus
  // fill fields after initial load
  React.useEffect(() => {
    if (address) {
      if (address?.cep) setCEP(address.cep);
      if (address?.address) setStreet(address.address);
      if (address?.number) setNumber(address.number);
      if (address?.additional) setAdditional(address.additional);
      if (address?.city) setCity(address.city);
      if (address?.state) setState(address.state);
    }
  }, [address]);

  // UI
  return (
    <Box>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          onSubmitHandler();
        }}
      >
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
        <Input
          isRequired
          id="delivery-address"
          flex={{ base: 1, md: 4 }}
          label={t('Endereço')}
          placeholder={t('Logradouro')}
          value={street}
          onChange={(ev) => setStreet(ev.target.value)}
        />
        <HStack mt="4" spacing={4}>
          <Input
            isRequired
            id="delivery-address-number"
            mt="0"
            flex={1}
            label={t('Número')}
            ref={numberRef}
            placeholder={t('000')}
            value={number}
            onChange={(ev) => setNumber(ev.target.value)}
          />
          <Input
            id="delivery-complement"
            mt="0"
            flex={1}
            label={t('Complemento')}
            placeholder={t('Sem complemento')}
            value={additional}
            onChange={(ev) => setAdditional(ev.target.value)}
          />
        </HStack>
        <Input
          id="delivery-city"
          label={t('Cidade')}
          placeholder={t('Digite a cidade')}
          value={city}
          onChange={(ev) => setCity(ev.target.value)}
        />
        <Input
          id="delivery-state"
          label={t('Estado')}
          placeholder={t('Digite o estado')}
          value={state}
          onChange={(ev) => setState(ev.target.value)}
        />
        <Button
          mt="8"
          minW="200px"
          type="submit"
          size="lg"
          fontSize="sm"
          fontWeight="500"
          fontFamily="Barlow"
          isLoading={isLoading}
          loadingText={t('Salvando')}
        >
          {t('Salvar')}
        </Button>
        {isSuccess && (
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
