import { Button } from '@chakra-ui/react';
import PageHeader from 'pages/PageHeader';
import PageLayout from 'pages/PageLayout';
import React from 'react';
import { t } from 'utils/i18n';

const Home = () => {
  return (
    <PageLayout>
      <PageHeader title={t('Cardápio')} subtitle={t('Defina o cardápio do seu restaurante.')} />
      <Button>{t('Adicionar restaurante')}</Button>
    </PageLayout>
  );
};

export default Home;
