import {
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  Radio,
  RadioGroup,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { ProfileSituation } from 'appjusto-types';
import { AlertError } from 'common/components/AlertError';
import { AlertSuccess } from 'common/components/AlertSuccess';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../SectionTitle';

interface BusinessStatusProps {
  situation: ProfileSituation | undefined;
}

export const BusinessStatus = ({ situation }: BusinessStatusProps) => {
  // context
  const { updateBusinessProfile, result } = useBusinessProfile();
  const { isLoading, isSuccess, isError } = result;
  // state
  const [status, setStatus] = React.useState<ProfileSituation>('pending');
  const [issues, setIssues] = React.useState<string[]>([]);
  const [message, setMessage] = React.useState('');

  // handlers
  const onSubmitHandler = () => {
    updateBusinessProfile({
      situation: status,
    });
    if (status === 'rejected') {
      // send rejection reason and message
    }
  };

  // side effects
  React.useEffect(() => {
    if (situation) setStatus(situation);
  }, [situation]);

  // UI
  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        onSubmitHandler();
      }}
    >
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
      <Button
        mt="8"
        minW="200px"
        type="submit"
        size="lg"
        fontSize="sm"
        fontWeight="500"
        fontFamily="Barlow"
        isLoading={isLoading}
        loadingText={t('Salvando')}
      >
        {t('Salvar')}
      </Button>
      {isSuccess && (
        <AlertSuccess maxW="426px" title={t('Informações salvas com sucesso!')} description={''} />
      )}
      {isError && (
        <AlertError
          maxW="426px"
          title={t('Erro')}
          description={'Não foi possível acessar o servidor. Tenta novamente?'}
        />
      )}
    </form>
  );
};
