import {
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  Radio,
  RadioGroup,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { Issue, ProfileSituation, WithId } from 'appjusto-types';
import { AlertError } from 'common/components/AlertError';
import { AlertSuccess } from 'common/components/AlertSuccess';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';
import { Result, UpdateProfile } from '../generics/types';

interface StatusTabProps {
  type: string;
  situation?: ProfileSituation;
  marketPlaceIssues?: string[];
  profileIssuesMessage?: string;
  profileIssues?: string[];
  profileIssuesOptions?: WithId<Issue>[] | null;
  updateProfile: UpdateProfile;
  result: Result;
}

export const StatusTab = ({
  type,
  situation,
  marketPlaceIssues,
  profileIssues,
  profileIssuesMessage,
  profileIssuesOptions,
  updateProfile,
  result,
}: StatusTabProps) => {
  // context
  const { isLoading, isSuccess, isError } = result;
  // state
  const [status, setStatus] = React.useState<ProfileSituation>('pending');
  const [financialIssues, setFinancialIssues] = React.useState<string[]>([]);
  const [issues, setIssues] = React.useState<string[]>([]);
  const [message, setMessage] = React.useState('');
  // handlers
  const onSubmitHandler = () => {
    updateProfile({
      situation: status,
      profileIssues: issues,
      profileIssuesMessage: message,
    });
  };
  // side effects
  React.useEffect(() => {
    if (situation) setStatus(situation);
    if (marketPlaceIssues) setFinancialIssues(marketPlaceIssues);
    // if profileIssues, handle it
  }, [situation, marketPlaceIssues]);

  React.useEffect(() => {
    if (profileIssues) {
      setIssues(profileIssues);
    }
  }, [profileIssues]);

  React.useEffect(() => {
    if (profileIssuesMessage) {
      setMessage(profileIssuesMessage);
    }
  }, [profileIssuesMessage]);
  // UI
  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        onSubmitHandler();
      }}
    >
      {(status === 'invalid' || status === 'rejected') && marketPlaceIssues && (
        <AlertError
          title={t(
            `Problemas identificados na verificação financeira: (${financialIssues?.length ?? 0})`
          )}
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
      <SectionTitle mt="0">{t(`Alterar status do ${type}:`)}</SectionTitle>
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
            {t(`Bloquear ${type}`)}
          </Radio>
        </Flex>
      </RadioGroup>
      {status === 'rejected' && (
        <>
          <SectionTitle>{t('Motivo da recusa:')}</SectionTitle>
          <CheckboxGroup
            colorScheme="green"
            value={issues}
            onChange={(value) => setIssues(value as string[])}
          >
            <VStack alignItems="flex-start" mt="4" color="black" spacing={2}>
              {profileIssuesOptions?.map((issue) => (
                <Checkbox key={issue.id} iconColor="white" value={issue.title}>
                  {issue.title}
                </Checkbox>
              ))}
            </VStack>
          </CheckboxGroup>
          <SectionTitle>{t('Mensagem personalizada:')}</SectionTitle>
          <Textarea mt="2" value={message} onChange={(ev) => setMessage(ev.target.value)} />
        </>
      )}
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
