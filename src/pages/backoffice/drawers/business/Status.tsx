import {
  Checkbox,
  CheckboxGroup,
  Flex,
  Radio,
  RadioGroup,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { ProfileSituation } from 'appjusto-types';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../SectionTitle';

interface BusinessStatusProps {
  situation: ProfileSituation | undefined;
}

export const BusinessStatus = ({ situation }: BusinessStatusProps) => {
  // context

  // state
  const [status, setStatus] = React.useState<ProfileSituation>('pending');
  const [issues, setIssues] = React.useState<string[]>([]);
  const [message, setMessage] = React.useState('');

  // handlers
  // handleSubmit => updateBusinessProfile with id

  // side effects
  React.useEffect(() => {
    if (situation) setStatus(situation);
  }, [situation]);

  // UI
  return (
    <>
      <SectionTitle mt="0">{t('Alterar status do restaurante:')}</SectionTitle>
      <RadioGroup
        mt="2"
        onChange={(value: ProfileSituation) => setStatus(value)}
        value={status}
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
          <Radio mt="2" value="submitted">
            {t('Aguardando aprovação')}
          </Radio>
          <Radio mt="2" value="rejected">
            {t('Recusado')}
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
    </>
  );
};
