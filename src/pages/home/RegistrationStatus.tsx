import { Box, Button, HStack, Link, Spinner, Text, VStack } from '@chakra-ui/react';
import { useBusinessBankAccount } from 'app/api/business/profile/useBusinessBankAccount';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextBusiness } from 'app/state/business/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import { AlertError } from 'common/components/AlertError';
import { AlertWarning } from 'common/components/AlertWarning';
import { ReactComponent as CheckmarkChecked } from 'common/img/checkmark-checked.svg';
import { ReactComponent as Checkmark } from 'common/img/checkmark.svg';
import React from 'react';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';

const initialState = [
  {
    status: false,
    type: 'manager',
    label: 'Perfil do administrador e dados bancários',
    link: 'manager-profile',
  },
  { status: false, type: 'business', label: 'Perfil do restaurante', link: 'business-profile' },
  { status: false, type: 'address', label: 'Endereço e área de entrega', link: 'delivery-area' },
];

export const RegistrationStatus = () => {
  // context
  const { path } = useRouteMatch();
  const manager = useContextManagerProfile();
  const business = useContextBusiness();
  const { bankAccount } = useBusinessBankAccount();
  const { updateBusinessProfile } = useBusinessProfile();

  // state
  const [isFetching, setIsFetching] = React.useState(true);
  const [validation, setValidation] = React.useState(initialState);
  const [error, setError] = React.useState({ status: false, message: '' });
  const [rejection, setRejection] = React.useState<string[]>([]);
  const isValid = validation.filter((data) => data.status === false).length === 0;

  // handlers
  const handleSubmitRegistration = () => {
    if (isValid) {
      try {
        updateBusinessProfile({
          situation: 'submitted',
        });
      } catch (error) {
        console.dir(error);
        setError({
          status: true,
          message: 'Ocorreu um erro ao enviar o cadastro. Você poderia tentar novamente?',
        });
      }
    }
  };

  // side effects
  React.useEffect(() => {
    if (business) {
      const isManagerInfos = manager?.phone && manager.cpf ? true : false;
      const isBankingInfos =
        bankAccount?.type && bankAccount?.name && bankAccount?.account && bankAccount.agency
          ? true
          : false;
      const isBusinessInfos = business?.name && business?.cnpj && business.phone ? true : false;
      const isAddressInfos =
        business?.businessAddress?.address &&
        business?.businessAddress?.cep &&
        business?.businessAddress?.city &&
        business?.businessAddress?.state
          ? true
          : false;
      setValidation((prevState) => {
        const newState = prevState.map((data) => {
          if (data.type === 'manager') {
            const status = isManagerInfos && isBankingInfos;
            return { ...data, status };
          } else if (data.type === 'business') {
            const status = isBusinessInfos;
            return { ...data, status };
          } else {
            const status = isAddressInfos;
            return { ...data, status };
          }
        });
        return newState;
      });
      setIsFetching(false);
    }
  }, [manager, business, bankAccount]);

  React.useEffect(() => {
    if (business?.situation === 'rejected') {
      setRejection(business?.profileIssues ?? []);
    }
  }, [business]);

  // UI
  if (isFetching) {
    return <Spinner size="sm" />;
  }
  if (business?.situation === 'pending') {
    return (
      <>
        <AlertWarning
          hasIcon={false}
          title={isValid ? t('Dados prontos para envio') : t('Dados incompletos')}
          description={
            isValid
              ? t(
                  'Agora você pode enviar os seus dados para aprovação! Basta clicar no botão abaixo:'
                )
              : t(
                  'Antes de enviar o seu cadastro para aprovação, favor preencher os dados pendentes abaixo:'
                )
          }
        >
          <VStack mt="2" spacing={1} alignItems="flex-start">
            {validation.map((data, index) => {
              return (
                <HStack spacing={2}>
                  {data.status ? <CheckmarkChecked /> : <Checkmark />}
                  <Link key={data.type} as={RouterLink} to={`${path}/${data.link}`}>
                    {data.label}
                    {index + 1 < validation.length ? ';' : '.'}
                  </Link>
                </HStack>
              );
            })}
          </VStack>
        </AlertWarning>
        <Button mt="4" onClick={handleSubmitRegistration} isDisabled={!isValid}>
          {t('Enviar cadastro para aprovação')}
        </Button>
        {error.status && (
          <AlertError title={t('Erro de cadastro')} description={t(`${error.message}`)} />
        )}
      </>
    );
  }
  if (business?.situation === 'submitted') {
    return (
      <AlertWarning
        title={t('Restaurante em aprovação')}
        description={t(
          'O AppJusto está avaliando o seu cadastro e em breve você poderá aceitar pedidos. Por enquanto seu restaurante ainda não está disponível para clientes. Você será avisado quando estiver liberado. Aproveite para explorar o seu painel.'
        )}
      />
    );
  }
  if (business?.situation === 'rejected') {
    return (
      <>
        <AlertWarning
          title={t('Seus dados não foram aprovados')}
          description={t(
            'Ocorreram alguns erros durante a validação dos dados enviados. Favor checar os seguintes pontos abaixo, antes de reenviar os dados.'
          )}
        >
          <VStack mt="2" spacing={1} alignItems="flex-start">
            {rejection.map((issue) => (
              <Text key={issue}>* {t(`${issue}`)}</Text>
            ))}
          </VStack>
        </AlertWarning>
        <Button mt="4" onClick={handleSubmitRegistration} isDisabled={!isValid}>
          {t('Reenviar cadastro para aprovação')}
        </Button>
      </>
    );
  }
  return <Box />;
};
