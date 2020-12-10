import { Box, Button, Text } from '@chakra-ui/react';
import { useApi } from 'app/state/api/context';
import { useContextBusiness } from 'app/state/business/context';
import { Business } from 'appjusto-types';
import { Input } from 'common/components/form/input/Input';
import PageHeader from 'pages/PageHeader';
import PageLayout from 'pages/PageLayout';
import React from 'react';
import { useMutation } from 'react-query';
import { t } from 'utils/i18n';

const Profile = () => {
  // context
  const api = useApi();
  const business = useContextBusiness();

  // state
  const [name, setName] = React.useState(business?.name ?? '');

  // mutations
  const [updateBusiness] = useMutation(async (changes: Partial<Business>) => {
    api.business().updateBusinessProfile(business?.id!, changes);
  });

  // effects
  React.useEffect(() => {
    if (business) {
      setName(business.name);
    }
  }, [business]);

  // handlers
  const onSaveHandler = () => {
    (async () => {
      await updateBusiness({
        name,
      });
    })();
  };

  // UI
  return (
    <PageLayout>
      <PageHeader
        title={t('Perfil do restaurante')}
        subtitle={t('Inclua os dados do seu restaurante')}
      />
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          onSaveHandler();
        }}
      >
        <Box mt="6">
          <Text color="black" fontSize="xl">
            {t('Sobre o restaurante')}
          </Text>
          <Text mt="2" fontSize="md">
            {t('Esssas informações serão vistas por seus visitantes.')}
          </Text>
          <Input
            mt="2"
            label={t('Nome do restaurante')}
            placeholder={t('Nome')}
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
        </Box>
        <Box mt="6">
          <Button onClick={() => onSaveHandler()}>{t('Salvar alterações')}</Button>
        </Box>
      </form>
    </PageLayout>
  );
};

export default Profile;
