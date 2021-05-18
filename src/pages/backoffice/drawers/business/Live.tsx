import { Box, Flex, Radio, RadioGroup, Text } from '@chakra-ui/react';
import { useContextBusinessBackoffice } from 'app/state/business/businessBOContext';
import { BusinessStatus } from 'appjusto-types';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

export const BusinessLive = () => {
  // context
  const { business, handleBusinessStatusChange } = useContextBusinessBackoffice();

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
    handleBusinessStatusChange('status', isOpen);
    handleBusinessStatusChange('enabled', isEnabled === 'true' ? true : false);
  }, [isOpen, isEnabled]);

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
          <Radio mt="2" value="open">
            {t('Aberto')}
          </Radio>
          <Radio mt="2" value="closed">
            {t('Fechado')}
          </Radio>
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
