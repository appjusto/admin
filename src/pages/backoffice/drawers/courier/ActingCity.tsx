import { Box, HStack } from '@chakra-ui/react';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import React from 'react';
import { t } from 'utils/i18n';

export const ActingCity = () => {
  // state
  const [state, setState] = React.useState('');
  const [city, setCity] = React.useState('');

  // UI
  return (
    <Box mt="4">
      <HStack spacing={4}>
        <Input
          mt="0"
          id="acting-state"
          label={t('Estado')}
          placeholder={t('Digite o estado')}
          value={state}
          onChange={(ev) => setState(ev.target.value)}
        />
        <Input
          mt="0"
          id="acting-city"
          label={t('Cidade')}
          placeholder={t('Digite a cidade')}
          value={city}
          onChange={(ev) => setCity(ev.target.value)}
        />
      </HStack>
    </Box>
  );
};
