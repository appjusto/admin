import { Text } from '@chakra-ui/react';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';

const FinancesPage = () => {
  // context
  // state
  const [dateTime, setDateTime] = React.useState('');

  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);

  // UI
  return (
    <>
      <PageHeader title={t('Financeiro')} subtitle={t(`Dados atualizados em ${dateTime}`)} />
      <Text mt="4" fontSize="sm" fontWeight="700">
        {t(
          'Aqui você acomanhará os principais indicadores de desempenho financeiro do seu restaurante.'
        )}
      </Text>
    </>
  );
};

export default FinancesPage;
