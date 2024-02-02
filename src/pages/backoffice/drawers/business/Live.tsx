import { BusinessStatus, CookingTimeMode } from '@appjusto/types';
import { Box, Flex, Radio, RadioGroup, Text } from '@chakra-ui/react';
import { useContextBusinessBackoffice } from 'app/state/business/businessBOContext';
import { BusinessAverageCookingTime } from 'pages/delivery-area/BusinessAverageCookingTime';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

export const BusinessLive = () => {
  // context
  const { business, isBusinessOpen, handleBusinessProfileChange } =
    useContextBusinessBackoffice();
  // state
  const [status, setStatus] = React.useState<BusinessStatus>(
    business?.status ?? 'unavailable'
  );
  const [isEnabled, setIsEnabled] = React.useState(
    business?.enabled ? 'true' : 'false'
  );
  // handlers
  const handleCookingTimeMode = (mode: CookingTimeMode) => {
    handleBusinessProfileChange('settings', {
      ...business?.settings,
      cookingTimeMode: mode,
    });
  };
  // side effects
  React.useEffect(() => {
    if (business?.status) setStatus(business.status);
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
    handleBusinessProfileChange('status', status);
    handleBusinessProfileChange('enabled', isEnabled === 'true' ? true : false);
  }, [status, isEnabled, handleBusinessProfileChange]);
  // UI
  return (
    <Box>
      <SectionTitle mt="0">
        {t(`Restaurante ${isBusinessOpen ? 'aberto' : 'fechado'}`)}
      </SectionTitle>
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
      <SectionTitle>{t('Fechamento de emergência:')}</SectionTitle>
      <Text fontSize="15px" lineHeight="21px">
        {t(
          'O restaurante ficará fechado até que o fechamento de emergência seja desativado'
        )}
      </Text>
      <RadioGroup
        mt="2"
        onChange={(value: BusinessStatus) => setStatus(value)}
        value={status}
        color="black"
      >
        <Flex flexDir="column" justifyContent="flex-start">
          <Radio mt="2" value="available">
            {t('Fechamento desativado')}
          </Radio>
          <Radio mt="2" value="unavailable">
            {t('Fechamento ativado')}
          </Radio>
        </Flex>
      </RadioGroup>
      <SectionTitle>{t('Visibilidade no marketplace:')}</SectionTitle>
      <Text fontSize="15px" lineHeight="21px">
        {t(
          'Defina se o restaurante estará visível, ou não, no marketplace do appjusto'
        )}
      </Text>
      <RadioGroup
        mt="2"
        onChange={(value) => setIsEnabled(value.toString())}
        value={isEnabled}
        color="black"
      >
        <Flex flexDir="column" justifyContent="flex-start">
          <Radio mt="2" value="true">
            {t('Visível')}
          </Radio>
          <Radio mt="2" value="false">
            {t('Invisível')}
          </Radio>
        </Flex>
      </RadioGroup>
    </Box>
  );
};
