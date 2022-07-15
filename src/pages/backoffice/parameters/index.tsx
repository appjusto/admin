import { Box } from '@chakra-ui/react';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import TaxesParameters from './sections/taxes';

const ParamatersPage: React.FC = () => {
  const [dateTime, setDateTime] = React.useState('');

  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);

  return (
    <Box>
      <PageHeader title={t('Parâmetros')} subtitle={t(`Atualizado em ${dateTime}`)} />
      <TaxesParameters />
    </Box>
  );
};
export default ParamatersPage;
