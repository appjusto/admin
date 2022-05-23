import { Box, Flex, Stack } from '@chakra-ui/react';
import { useContextBusinessBackoffice } from 'app/state/business/businessBOContext';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import { CustomNumberInput as NumberInput } from 'common/components/form/input/CustomNumberInput';
import { CustomPatternInput as PatternInput } from 'common/components/form/input/pattern-input/CustomPatternInput';
import { cepFormatter, cepMask } from 'common/components/form/input/pattern-input/formatters';
import { numbersOnlyParser } from 'common/components/form/input/pattern-input/parsers';
import { Select } from 'common/components/form/select/Select';
import React from 'react';
import { t } from 'utils/i18n';
import { getCitiesByState, IBGEResult, UF } from '../../../../../utils/ApiIBGE';
import ufs from '../../../../../utils/ufs';

export const BOBusinessAddress = () => {
  // context
  const { business, handleBusinessProfileChange, handleBusinessAddressChange } =
    useContextBusinessBackoffice();
  const businessAddress = business?.businessAddress;
  // state
  const [cities, setCities] = React.useState<string[]>([]);
  // helpers
  const deliveryRange =
    typeof business?.deliveryRange === 'number' ? (business.deliveryRange / 1000).toString() : '';
  // side effects
  React.useEffect(() => {
    setCities([]);
    if (!businessAddress?.state) return;
    (async () => {
      const citiesList = await getCitiesByState(businessAddress.state as UF);
      setCities(citiesList?.map((cityInfo: IBGEResult) => cityInfo?.nome));
    })();
  }, [businessAddress?.state]);
  // UI
  return (
    <Box>
      <PatternInput
        isRequired
        id="delivery-postalcode"
        label={t('CEP *')}
        placeholder={t('CEP')}
        mask={cepMask}
        formatter={cepFormatter}
        parser={numbersOnlyParser}
        value={businessAddress?.cep ?? ''}
        onValueChange={(value) => handleBusinessAddressChange('cep', value)}
        validationLength={8}
      />
      <Stack mt="4" spacing={4} direction="row">
        <Select
          mt="0"
          maxW={{ base: '90px', md: '110px' }}
          id="delivery-state"
          label="UF *"
          placeholder="UF"
          value={businessAddress?.state ?? ''}
          onChange={(ev) => handleBusinessAddressChange('state', ev.target.value)}
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
          value={businessAddress?.city ?? ''}
          onChange={(ev) => handleBusinessAddressChange('city', ev.target.value)}
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
        value={businessAddress?.neighborhood ?? ''}
        onChange={(ev) => handleBusinessAddressChange('neighborhood', ev.target.value)}
        isRequired
      />
      <Flex flexDir={{ base: 'column', md: 'row' }}>
        <Input
          isRequired
          id="delivery-address"
          flex={{ base: 1, md: 4 }}
          label={t('Endereço *')}
          placeholder={t('Seu endereço')}
          value={businessAddress?.address ?? ''}
          onChange={(ev) => handleBusinessAddressChange('address', ev.target.value)}
        />
        <Input
          isRequired
          id="delivery-address-number"
          flex={1}
          ml={{ base: '0', md: '4' }}
          label={t('Número *')}
          placeholder={t('000')}
          value={businessAddress?.number ?? ''}
          onChange={(ev) => handleBusinessAddressChange('number', ev.target.value)}
        />
      </Flex>
      <Input
        id="delivery-complement"
        label={t('Complemento')}
        placeholder={t('Seu complemento')}
        value={businessAddress?.additional ?? ''}
        onChange={(ev) => handleBusinessAddressChange('additional', ev.target.value)}
      />
      <NumberInput
        isRequired
        id="delivery-ray"
        maxW="160px"
        label={t('Raio de entrega (km) *')}
        value={deliveryRange}
        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
          const value = parseInt(ev.target.value) * 1000;
          handleBusinessProfileChange('deliveryRange', value);
        }}
      />
    </Box>
  );
};
