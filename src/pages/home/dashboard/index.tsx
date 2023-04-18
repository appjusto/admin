import { Link, Stack, Text } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import React from 'react';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { RegistrationStatus } from '../RegistrationStatus';
import { Panel } from './panel';

const Dashboard = () => {
  // context
  const { business } = useContextBusiness();
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
      <PageHeader
        title={
          business?.situation === 'pending'
            ? t('Boas-vindas ao painel do seu restaurante! 🎉')
            : t('Início')
        }
        subtitle={t(`Dados atualizados em ${dateTime}`)}
      />
      {business?.situation === 'approved' ? <Panel /> : <RegistrationStatus />}
      <Stack
        mt="14"
        w="100%"
        direction={{ base: 'column', md: 'row' }}
        spacing={6}
        justifyContent="center"
      >
        <Link
          isExternal
          href="https://github.com/appjusto/docs/blob/main/legal/politica-de-privacidade.md"
          fontSize="15px"
          textDecor="underline"
          _hover={{ color: 'gray.900' }}
          _focus={{ outline: 'none' }}
        >
          {t('Política de Privacidade')}
        </Link>
        <Link
          isExternal
          href="https://github.com/appjusto/docs/blob/main/legal/termos-de-uso-restaurantes.md"
          fontSize="15px"
          textDecor="underline"
          _hover={{ color: 'gray.900' }}
          _focus={{ outline: 'none' }}
        >
          {t('Termos de uso')}
        </Link>
        <Text fontSize="15px">© {new Date().getFullYear()} AppJusto</Text>
      </Stack>
    </>
  );
};

export default Dashboard;
