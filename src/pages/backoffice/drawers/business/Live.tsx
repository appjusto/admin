import { BusinessStatus } from '@appjusto/types';
import { Box, Flex, RadioGroup, Text } from '@chakra-ui/react';
import { useContextBusinessBackoffice } from 'app/state/business/businessBOContext';
import CustomCheckbox from 'common/components/form/CustomCheckbox';
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

  // side effects
  React.useEffect(() => {
    if (business?.status) setIsOpen(business.status);
  }, [business?.status]);

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
      <SectionTitle>{t('Permitir que restaurante defina o Cooking Time:')}</SectionTitle>
      <Text fontSize="15px" lineHeight="21px">
        {t(
          'Ao permitir, restaurante deve definir o tempo de preparo no gerenciador de pedidos. Caso desmarcado, os pedidos aceitos receberão o tempo médio de preparo (averageCookingTime)'
        )}
      </Text>
      <CustomCheckbox mt="4" colorScheme="green">
        {t('Permitir')}
      </CustomCheckbox>
      <SectionTitle>{t('Ativar ”Pedido pronto” automaticamente:')}</SectionTitle>
      <Text fontSize="15px" lineHeight="21px">
        {t(
          'Ao ativar, o restaurante não pode marcar o pedido como pronto (será definido de acordo com o Cooking Time). Caso desmarcado, o restaurante deve marcar o ’Pedido pronto’ no gerenciador'
        )}
      </Text>
      <CustomCheckbox mt="4" colorScheme="green">
        {t('Ativar')}
      </CustomCheckbox>
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
