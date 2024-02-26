import { BusinessStatus, CookingTimeMode } from '@appjusto/types';
import { Box, Flex, Radio, RadioGroup, Text } from '@chakra-ui/react';
import { useContextBusinessBackoffice } from 'app/state/business/businessBOContext';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { Timestamp } from 'firebase/firestore';
import { BusinessAverageCookingTime } from 'pages/delivery-area/BusinessAverageCookingTime';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';
import {
  getAvailableAtMinDate,
  getStringDateFromTimestamp,
  getTimestampFromStringDate,
} from './utils';

export const BusinessLive = () => {
  // context
  const { business, isBusinessOpen, handleBusinessProfileChange } =
    useContextBusinessBackoffice();
  // handlers
  const handleCookingTimeMode = (mode: CookingTimeMode) => {
    handleBusinessProfileChange('settings', {
      ...business?.settings,
      cookingTimeMode: mode,
    });
  };
  // side effects
  React.useEffect(() => {
    if (!business?.settings) {
      handleBusinessProfileChange('settings', { cookingTimeMode: 'manual' });
    }
  }, [business?.settings, handleBusinessProfileChange]);
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
          'O restaurante ficará fechado até a data de retorno definida, ou até que o fechamento de emergência seja desativado'
        )}
      </Text>
      <RadioGroup
        mt="4"
        onChange={(value: BusinessStatus) =>
          handleBusinessProfileChange('status', value)
        }
        value={business?.status ?? 'unavailable'}
        color="black"
      >
        <Flex flexDir="column" justifyContent="start" gap="2">
          <Radio value="available">{t('Fechamento desativado')}</Radio>
          <Radio value="unavailable">{t('Fechamento ativado')}</Radio>
          <Box p="4" border="1px solid grey" borderRadius="lg">
            <Text fontSize="sm">Data de retorno definida:</Text>
            <CustomInput
              mt="2"
              maxW="160px"
              type="date"
              id="availableAt"
              value={getStringDateFromTimestamp(
                business?.availableAt as Timestamp
              )}
              onChange={(event) => {
                handleBusinessProfileChange(
                  'availableAt',
                  getTimestampFromStringDate(event.target.value)
                );
              }}
              min={getAvailableAtMinDate()}
              label={t('Data de retorno')}
              isDisabled={business?.status === 'available'}
            />
          </Box>
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
        onChange={(value) =>
          handleBusinessProfileChange('enabled', value === 'true')
        }
        value={business?.enabled ? 'true' : 'false'}
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
