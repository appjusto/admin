import { Box, Button, Flex, Icon, Link, Stack, Text } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import React from 'react';
import { IoIosWarning } from 'react-icons/io';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { RegistrationStatus } from '../registration/RegistrationStatus';
import { Panel } from './panel';
import { PreparingOperation } from './PreparingOperation';

const Dashboard = () => {
  // context
  const { business } = useContextBusiness();
  // state
  const [dateTime, setDateTime] = React.useState('');
  // helpers
  const isOperationValidated = React.useMemo(
    () => (business?.statistics?.totalOrders ?? 0) > 5,
    [business?.statistics]
  );
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
      <Flex
        mt="6"
        border="1px solid #FFBE00"
        borderRadius="lg"
        bgColor="#FFF6D9"
        px="6"
        py="5"
        alignItems="center"
        justifyContent="space-between"
        gap="4"
      >
        <Flex alignItems="center" gap="4">
          <Icon as={IoIosWarning} w="6" h="6" color="#FFBE00" />
          <Box>
            <Text color="black">
              {t('Encerraremos nossa operação no dia 08/09/2024')}
            </Text>
            <Text>
              {t('Leia o comunicado de encerramento das operações do appjusto')}
            </Text>
          </Box>
        </Flex>
        <Link href="https://appjusto.com.br" target="_blank">
          <Button variant="secondary">{t('Ler comunicado')}</Button>
        </Link>
      </Flex>
      {business?.situation !== 'approved' ? (
        <RegistrationStatus />
      ) : isOperationValidated ? (
        <Panel />
      ) : (
        <PreparingOperation />
      )}
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
        <Text fontSize="15px">© {new Date().getFullYear()} appjusto</Text>
      </Stack>
    </>
  );
};

export default Dashboard;
