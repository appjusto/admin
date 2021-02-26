import React from 'react';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../PageHeader';

const Dashboard = () => {
  const [dateTime, setDateTime] = React.useState('');
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);
  return <PageHeader title={t('Início')} subtitle={t(`Dados atualizados em ${dateTime}`)} />;
};

export default Dashboard;
