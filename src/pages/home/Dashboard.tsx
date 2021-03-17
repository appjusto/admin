import { Button, Text } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import { AlertError } from 'common/components/AlertError';
import { AlertWarning } from 'common/components/AlertWarning';
import React from 'react';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../PageHeader';

const Dashboard = () => {
  // context
  const business = useContextBusiness();
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [error, setError] = React.useState({ status: false, message: '' });

  // handlers
  const handleSubmitRegistration = () => {
    setError({
      status: true,
      message: 'Favor preencher todos os dados necessários para o envio do cadastro.',
    });
  };
  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);

  // UI
  return (
    <>
      <PageHeader title={t('Início')} subtitle={t(`Dados atualizados em ${dateTime}`)} />
      {business?.situation === 'pending' && (
        <>
          <AlertWarning
            title={t('Dados incompletos')}
            description={t(
              'Quando concluir o preenchimento de todas as informações necessárias para submeter o seu cadastro, basta clicar no botão abaixo:'
            )}
          />
          <Button mt="4" onClick={handleSubmitRegistration}>
            {t('Enviar cadastro para aprovação')}
          </Button>
          {error.status && (
            <AlertError title={t('Erro de cadastro')} description={t(`${error.message}`)} />
          )}
        </>
      )}
      {business?.situation === 'submitted' && (
        <AlertWarning
          title={t('Restaurante em aprovação')}
          description={t(
            'O AppJusto está avaliando o seu cadastro e em breve você poderá aceitar pedidos. Por enquanto seu restaurante ainda não está disponível para clientes. Você será avisado quando estiver liberado. Aproveite para explorar o seu painel.'
          )}
        />
      )}
      {business?.situation === 'approved' && (
        <Text fontSize="lg" fontWeight="700">
          Aprovado!!!
        </Text>
      )}
    </>
  );
};

export default Dashboard;
