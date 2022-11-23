import { BusinessStatus, CookingTimeMode } from '@appjusto/types';
import { Box, Flex, Radio, RadioGroup, Text } from '@chakra-ui/react';
import { useContextBusinessBackoffice } from 'app/state/business/businessBOContext';
import { BusinessAverageCookingTime } from 'pages/delivery-area/BusinessAverageCookingTime';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

export const BusinessLive = () => {
  // context
  const { business, handleBusinessProfileChange } =
    useContextBusinessBackoffice();

  // state
  const [isOpen, setIsOpen] = React.useState<BusinessStatus>(
    business?.status ?? 'unavailable'
  );
  const [isEnabled, setIsEnabled] = React.useState(
    business?.enabled ? 'true' : 'false'
  );

  // handlers
  const handleEnabled = (enabled: string) => {
    if (enabled === 'true') setIsEnabled(enabled);
    else {
      setIsOpen('unavailable');
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
    if (business?.enabled !== undefined)
      setIsEnabled(business.enabled.toString());
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
      >
        <Flex flexDir="column" justifyContent="flex-start">
          <Radio mt="2" value="open">
            {t('Aberto')}
          </Radio>
          <Radio mt="2" value="closed">
            {t('Fechado')}
          </Radio>
        </Flex>
      </RadioGroup>
      <SectionTitle>
        {t('Modo do tempo de preparo (cooking time):')}
      </SectionTitle>
      <Text fontSize="15px" lineHeight="21px">
        {t(
          'No modo manual (padrão) o restaurante pode definir seu tempo médio de preparo, o tempo de preparo de cada pedido e avançar o pedido de "em preparo" para "pronto". No modo automático, a definição dos tempos de preparo e avanço para "pronto" é automática'
        )}
      </Text>
      <RadioGroup
        mt="2"
        onChange={(value: CookingTimeMode) => handleCookingTimeMode(value)}
        value={business?.settings?.cookingTimeMode}
      >
        <Flex flexDir="column" justifyContent="flex-start">
          <Radio mt="2" value="manual">
            {t('Manual')}
          </Radio>
          <Radio mt="2" value="auto">
            {t('Automático')}
          </Radio>
        </Flex>
      </RadioGroup>
      <SectionTitle>{t('Tempo médio de preparo dos pratos:')}</SectionTitle>
      <Text fontSize="15px" lineHeight="21px">
        {t(
          'O tempo médio de preparo será usado para o agendamento do matching, sempre que o tempo de preparo específico de um pedido não for informado'
        )}
      </Text>
      <BusinessAverageCookingTime
        averageCookingTime={business?.averageCookingTime}
        getAverageCookingTime={(value) =>
          handleBusinessProfileChange('averageCookingTime', value)
        }
        cookingTimeMode={business?.settings?.cookingTimeMode}
      />
      <SectionTitle>{t('Desligar restaurante do AppJusto:')}</SectionTitle>
      <Text fontSize="15px" lineHeight="21px">
        {t(
          'Ao desligar o restaurante, ele não aparecerá no app enquanto estiver desligado'
        )}
      </Text>
      <RadioGroup
        mt="2"
        onChange={(value) => handleEnabled(value.toString())}
        value={isEnabled}
        color="black"
      >
        <Flex flexDir="column" justifyContent="flex-start">
          <Radio mt="2" value="true">
            {t('Ligado')}
          </Radio>
          <Radio mt="2" value="false">
            {t('Desligado')}
          </Radio>
        </Flex>
      </RadioGroup>
    </Box>
  );
};
