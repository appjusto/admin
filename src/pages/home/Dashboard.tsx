import { Text } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import React from 'react';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../PageHeader';
import { RegistrationStatus } from './RegistrationStatus';

const Dashboard = () => {
  // context
  const business = useContextBusiness();
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
      <PageHeader title={t('Início')} subtitle={t(`Dados atualizados em ${dateTime}`)} />
      {business?.situation === 'approved' ? (
        <Text mt="4" fontSize="lg" fontWeight="700">
          Dashboard !
        </Text>
      ) : (
        <RegistrationStatus />
      )}
    </>
  );
};

export default Dashboard;
