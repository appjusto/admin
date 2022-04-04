import { BusinessStatus, CookingTimeMode } from '@appjusto/types';
import { Box, Flex, RadioGroup, Text } from '@chakra-ui/react';
import { useContextBusinessBackoffice } from 'app/state/business/businessBOContext';
import CustomRadio from 'common/components/form/CustomRadio';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

export const BusinessLive = () => {
  // context
  const { business, handleBusinessProfileChange } = useContextBusinessBackoffice();

  // state
  const [isOpen, setIsOpen] = React.useState<BusinessStatus>(business?.status ?? 'closed');
  const [isEnabled, setIsEnabled] = React.useState(business?.enabled ? 'true' : 'false');

  // handlers
  const handleEnabled = (enabled: string) => {
    if (enabled === 'true') setIsEnabled(enabled);
    else {
      setIsOpen('closed');
      setIsEnabled('false');
    }
  };

  const handleCookingTimeMode = (mode: CookingTimeMode) => {
    handleBusinessProfileChange('settings', {
      ...business?.settings,
      cookingTimeMode: mode,
    });
  };

  // side effects
  React.useEffect(() => {
    if (business?.status) setIsOpen(business.status);
  }, [business?.status]);

  React.useEffect(() => {
    if (!business?.settings) {
      handleBusinessProfileChange('settings', { cookingTimeMode: 'manual' });
    }
  }, [business?.settings, handleBusinessProfileChange]);

  React.useEffect(() => {
    if (business?.enabled !== undefined) setIsEnabled(business.enabled.toString());
  }, [business?.enabled]);

  React.useEffect(() => {
    handleBusinessProfileChange('status', isOpen);
    handleBusinessProfileChange('enabled', isEnabled === 'true' ? true : false);
  }, [isOpen, isEnabled, handleBusinessProfileChange]);

  // UI
  return (
    <Box>
      <SectionTitle mt="0">{t('Restaurante agora:')}</SectionTitle>
      <RadioGroup
        mt="2"
        onChange={(value) => {
          if (isEnabled === 'true') setIsOpen(value as BusinessStatus);
        }}
        value={isOpen}
        defaultValue="1"
        colorScheme="green"
        color="black"
        fontSize="15px"
        lineHeight="21px"
      >
        <Flex flexDir="column" justifyContent="flex-start">
          <CustomRadio mt="2" value="open">
            {t('Aberto')}
          </CustomRadio>
          <CustomRadio mt="2" value="closed">
            {t('Fechado')}
          </CustomRadio>
        </Flex>
      </RadioGroup>
      <SectionTitle>{t('Modo do tempo de preparo (cooking time):')}</SectionTitle>
      <Text fontSize="15px" lineHeight="21px">
        {t(
          'No modo manual (padrão) o restaurante pode definir seu tempo médio de preparo, o tempo de preparo de cada pedido e avançar o pedido de "em preparo" para "pronto". No modo automático, a definição dos tempos de preparo e avanço para "pronto" é automática'
        )}
      </Text>
      <RadioGroup
        mt="2"
        onChange={(value: CookingTimeMode) => handleCookingTimeMode(value)}
        value={business?.settings?.cookingTimeMode}
        defaultValue="1"
        colorScheme="green"
        color="black"
        fontSize="15px"
        lineHeight="21px"
      >
        <Flex flexDir="column" justifyContent="flex-start">
          <CustomRadio mt="2" value="manual">
            {t('Manual')}
          </CustomRadio>
          <CustomRadio mt="2" value="auto">
            {t('Automático')}
          </CustomRadio>
        </Flex>
      </RadioGroup>
      <SectionTitle>{t('Desligar restaurante do AppJusto:')}</SectionTitle>
      <Text fontSize="15px" lineHeight="21px">
        {t('Ao desligar o restaurante, ele não aparecerá no app enquanto estiver desligado')}
      </Text>
      <RadioGroup
        mt="2"
        onChange={(value) => handleEnabled(value.toString())}
        value={isEnabled}
        defaultValue="1"
        colorScheme="green"
        color="black"
        fontSize="15px"
        lineHeight="21px"
      >
        <Flex flexDir="column" justifyContent="flex-start">
          <CustomRadio mt="2" value="true">
            {t('Ligado')}
          </CustomRadio>
          <CustomRadio mt="2" value="false">
            {t('Desligado')}
          </CustomRadio>
        </Flex>
      </RadioGroup>
    </Box>
  );
};
