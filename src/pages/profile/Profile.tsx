import { Box, Text } from '@chakra-ui/react';
import { Input } from 'common/components/form/Input';
import PageHeader from 'pages/PageHeader';
import PageLayout from 'pages/PageLayout';
import React from 'react';
import { t } from 'utils/i18n';

const Profile = () => {
  return (
    <PageLayout>
      <PageHeader
        title={t('Perfil do restaurante')}
        subtitle={t('Inclua os dados do seu restaurante')}
      />
      <Box mt="6">
        <Text color="black" fontSize="xl">
          {t('Sobre o restaurante')}
        </Text>
        <Text mt="2" fontSize="md">
          {t('Esssas informações serão vistas por seus visitantes.')}
        </Text>
        <Input mt="2" label={t('Nome do restaurante')} placeholder={t('Nome')} />
      </Box>
    </PageLayout>
  );
};

export default Profile;
