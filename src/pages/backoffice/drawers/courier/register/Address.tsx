import { Box, Flex, HStack } from '@chakra-ui/react';
import { useContextCourierProfile } from 'app/state/courier/context';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import { CustomPatternInput as PatternInput } from 'common/components/form/input/pattern-input/CustomPatternInput';
import { cepFormatter, cepMask } from 'common/components/form/input/pattern-input/formatters';
import { numbersOnlyParser } from 'common/components/form/input/pattern-input/parsers';
import React from 'react';
import { t } from 'utils/i18n';

export const Address = () => {
  // context
  const { courier, handleProfileChange } = useContextCourierProfile();

  // refs
  const cepRef = React.useRef<HTMLInputElement>(null);
  const numberRef = React.useRef<HTMLInputElement>(null);

  // handlers
  const handleInputChange = (field: string, value: string) => {
    const newCompany = {
      ...courier?.company,
      [field]: value,
    };
    handleProfileChange('company', newCompany);
  };

  // UI
  return (
    <Box>
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
          value={courier?.company?.cep ?? ''}
          onValueChange={(value) => handleInputChange('cep', value)}
          validationLength={8}
        />
      </Flex>
      <Input
        isRequired
        id="delivery-address"
        flex={{ base: 1, md: 4 }}
        label={t('Endereço')}
        placeholder={t('Logradouro')}
        value={courier?.company?.address ?? ''}
        onChange={(ev) => handleInputChange('address', ev.target.value)}
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
          value={courier?.company?.number ?? ''}
          onChange={(ev) => handleInputChange('number', ev.target.value)}
        />
        <Input
          id="delivery-complement"
          mt="0"
          flex={1}
          label={t('Complemento')}
          placeholder={t('Sem complemento')}
          value={courier?.company?.additional ?? ''}
          onChange={(ev) => handleInputChange('additional', ev.target.value)}
        />
      </HStack>
      <Input
        id="delivery-city"
        label={t('Cidade')}
        placeholder={t('Digite a cidade')}
        value={courier?.company?.city ?? ''}
        onChange={(ev) => handleInputChange('city', ev.target.value)}
      />
      <Input
        id="delivery-state"
        label={t('Estado')}
        placeholder={t('Digite o estado')}
        value={courier?.company?.state ?? ''}
        onChange={(ev) => handleInputChange('state', ev.target.value)}
      />
    </Box>
  );
};
