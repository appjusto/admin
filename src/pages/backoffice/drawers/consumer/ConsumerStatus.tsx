import { Box, Flex, Radio, RadioGroup, Textarea } from '@chakra-ui/react';
import { useContextConsumerProfile } from 'app/state/consumer/context';
import { ProfileSituation } from 'appjusto-types';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

export const ConsumerStatus = () => {
  // context
  const { consumer, handleProfileChange } = useContextConsumerProfile();

  // state
  //const [status, setStatus] = React.useState<ProfileSituation>('pending');
  //const [financialIssues, setFinancialIssues] = React.useState<string[]>([]);
  const [issues, setIssues] = React.useState<string[]>([]);
  const [message, setMessage] = React.useState('');

  // handlers

  // side effects

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
          <Radio mt="2" value="approved">
            {t('Ativo')}
          </Radio>
          <Radio mt="2" value="blocked">
            {t('Bloquear cliente')}
          </Radio>
        </Flex>
      </RadioGroup>
      <SectionTitle>{t('Mensagem personalizada:')}</SectionTitle>
      <Textarea mt="2" value={message} onChange={(ev) => setMessage(ev.target.value)} />
    </Box>
  );
};
