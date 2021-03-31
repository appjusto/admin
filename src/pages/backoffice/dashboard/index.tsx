import React from 'react';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { Panel } from './Panel';

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
      <Panel />
    </>
  );
};

export default BODashboard;
