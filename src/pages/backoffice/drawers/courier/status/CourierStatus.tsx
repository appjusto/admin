import {
  Box,
  Checkbox,
  CheckboxGroup,
  Flex,
  Radio,
  RadioGroup,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useContextCourierProfile } from 'app/state/courier/context';
import { ProfileSituation } from 'appjusto-types';
import { AlertError } from 'common/components/AlertError';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../../generics/SectionTitle';

export const CourierStatus = () => {
  // context
  const { courier, marketPlaceIssues, handleProfileChange } = useContextCourierProfile();

  // state
  //const [status, setStatus] = React.useState<ProfileSituation>('pending');
  const [financialIssues, setFinancialIssues] = React.useState<string[]>([]);
  const [issues, setIssues] = React.useState<string[]>([]);
  const [message, setMessage] = React.useState('');

  // handlers

  // side effects
  React.useEffect(() => {
    //if (courier?.situation) setStatus(courier.situation);
    if (marketPlaceIssues) setFinancialIssues(marketPlaceIssues);
    // if profileIssues, handle it
  }, [courier?.situation, marketPlaceIssues]);

  // UI
  return (
    <Box>
      {courier?.situation === 'invalid' && (
        <AlertError
          title={t('Problemas identificados na verificação financeira')}
          icon={false}
          border="2px solid #DC3545"
          mb="6"
        >
          <VStack mt="2" spacing={1} alignItems="flex-start">
            {financialIssues.map((issue) => (
              <Text key={issue}>* {t(`${issue}`)}</Text>
            ))}
          </VStack>
        </AlertError>
      )}
      <SectionTitle mt="0">{t('Alterar status do restaurante:')}</SectionTitle>
      <RadioGroup
        mt="2"
        onChange={(value: ProfileSituation) => handleProfileChange('situation', value)}
        value={courier?.situation ?? 'pending'}
        defaultValue="1"
        colorScheme="green"
        color="black"
        fontSize="15px"
        lineHeight="21px"
      >
        <Flex flexDir="column" justifyContent="flex-start">
          <Radio mt="2" value="approved">
            {t('Publicado')}
          </Radio>
          <Radio mt="2" value="rejected">
            {t('Recusado')}
          </Radio>
          <Radio mt="2" value="verified">
            {t('Verificado')}
          </Radio>
          <Radio mt="2" value="invalid">
            {t('Invalidado')}
          </Radio>
          <Radio mt="2" value="submitted">
            {t('Aguardando aprovação')}
          </Radio>
          <Radio mt="2" value="blocked">
            {t('Bloquear restaurante')}
          </Radio>
        </Flex>
      </RadioGroup>
      <SectionTitle>{t('Motivo da recusa:')}</SectionTitle>
      <CheckboxGroup
        colorScheme="green"
        value={issues}
        onChange={(value) => setIssues(value as string[])}
      >
        <VStack alignItems="flex-start" mt="4" color="black" spacing={2}>
          <Checkbox iconColor="white" value="manager">
            {t('Dados pessoais')}
          </Checkbox>
          <Checkbox iconColor="white" value="business">
            {t('Informações do restaurante')}
          </Checkbox>
          <Checkbox iconColor="white" value="banking">
            {t('Dados bancários')}
          </Checkbox>
          <Checkbox iconColor="white" value="schedules">
            {t('Horário de funcionamento')}
          </Checkbox>
          <Checkbox iconColor="white" value="address">
            {t('Endereço do estabelecimento')}
          </Checkbox>
          <Checkbox iconColor="white" value="menu">
            {t('Cardápio')}
          </Checkbox>
        </VStack>
      </CheckboxGroup>
      <SectionTitle>{t('Mensagem personalizada:')}</SectionTitle>
      <Textarea mt="2" value={message} onChange={(ev) => setMessage(ev.target.value)} />
    </Box>
  );
};
