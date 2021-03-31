import { Text } from '@chakra-ui/react';
import React from 'react';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../PageHeader';

const BODashboard = () => {
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
      <PageHeader title={t('Visão geral')} subtitle={t(`Atualizado ${dateTime}`)} />
      <Text mt="4" fontSize="sm" fontWeight="700">
        {t('Aqui você acomanhará os principais indicadores de desempenho do seu restaurante.')}
      </Text>
    </>
  );
};

export default BODashboard;
