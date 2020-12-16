import { useContextBusiness } from 'app/state/business/context';
import PageHeader from 'pages/PageHeader';
import PageLayout from 'pages/PageLayout';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';

const Home = () => {
  // context
  const business = useContextBusiness();

  // UI
  if (business?.onboarding !== 'completed') {
    return <Redirect to={`/onboarding/${!business?.onboarding ? '' : business.onboarding}`} />;
  }
  return (
    <PageLayout>
      <PageHeader title={t('Início')} subtitle={t('Dados atualizados em 00/00/0000 às 00:00')} />
    </PageLayout>
  );
};

export default Home;
