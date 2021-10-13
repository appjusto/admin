import { Box, Flex, RadioGroup, Textarea } from '@chakra-ui/react';
import { useContextConsumerProfile } from 'app/state/consumer/context';
import { ProfileSituation } from 'appjusto-types';
import CustomRadio from 'common/components/form/CustomRadio';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

export const ConsumerStatus = () => {
  // context
  const { consumer, handleProfileChange } = useContextConsumerProfile();
  // UI
  return (
    <Box>
      <SectionTitle mt="0">{t('Alterar status do cliente:')}</SectionTitle>
      <RadioGroup
        mt="2"
        onChange={(value: ProfileSituation) => handleProfileChange('situation', value)}
        value={consumer?.situation ?? 'pending'}
        defaultValue="1"
        colorScheme="green"
        color="black"
        fontSize="15px"
        lineHeight="21px"
      >
        <Flex flexDir="column" justifyContent="flex-start">
          <CustomRadio mt="2" value="approved">
            {t('Ativo')}
          </CustomRadio>
          <CustomRadio mt="2" value="blocked">
            {t('Bloquear cliente')}
          </CustomRadio>
        </Flex>
      </RadioGroup>
      <SectionTitle>{t('Mensagem personalizada:')}</SectionTitle>
      <Textarea
        mt="2"
        value={consumer?.profileIssuesMessage ?? ''}
        onChange={(ev) => handleProfileChange('profileIssuesMessage', ev.target.value)}
      />
    </Box>
  );
};
