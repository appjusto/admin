import { Box, HStack, Stack, Text } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import React from 'react';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../PageHeader';
import { RegistrationStatus } from './RegistrationStatus';

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
        title={t('Boas-vindas ao AppJusto')}
        subtitle={t(`Dados atualizados em ${dateTime}`)}
      />
      {business?.situation === 'approved' ? (
        <Box>
          <Box mt="8" border="1px solid #E5E5E5" borderRadius="lg" p="4">
            <SectionTitle mt="0" fontWeight="700">
              {t('Acompanhamento diário')}
            </SectionTitle>
            <Text mt="1" fontSize="xs">
              {t('Tempo real')}
            </Text>
            <Stack mt="3" direction={{ base: 'column', md: 'row' }} spacing={2}>
              <HStack
                h="132px"
                py="4"
                px="6"
                border="1px solid #6CE787"
                borderRadius="lg"
                alignItems="flex-start"
              >
                <Box>
                  <Text color="green.600" fontSize="15px" lineHeight="21px">
                    {t('Pedidos/ Hoje')}
                  </Text>
                  <Text mt="1" color="black" minW="140px" fontSize="2xl" lineHeight="30px">
                    100 pedidos
                  </Text>
                  <Text mt="1" fontSize="md" lineHeight="22px">
                    R$ 0,00
                  </Text>
                </Box>
                <Box>
                  <Text color="green.600" fontSize="15px" lineHeight="21px">
                    {t('Ticket médio/ Hoje')}
                  </Text>
                  <Text mt="1" color="black" fontSize="2xl" lineHeight="30px">
                    R$ 0,00
                  </Text>
                </Box>
              </HStack>
              <Box
                h="132px"
                py="4"
                px="6"
                border="1px solid #E5E5E5"
                borderRadius="lg"
                alignItems="flex-start"
              >
                <Text fontSize="15px" lineHeight="21px">
                  {t('Pedidos/ Julho')}
                </Text>
                <Text mt="1" color="black" minW="140px" fontSize="2xl" lineHeight="30px">
                  100 pedidos
                </Text>
                <Text mt="1" fontSize="md" lineHeight="22px">
                  R$ 0,00
                </Text>
              </Box>
              <Box
                h="132px"
                py="4"
                px="6"
                border="1px solid #E5E5E5"
                borderRadius="lg"
                alignItems="flex-start"
              >
                <Text fontSize="15px" lineHeight="21px">
                  {t('Ticket médio/ Julho')}
                </Text>
                <Text mt="1" color="black" fontSize="2xl" lineHeight="30px">
                  R$ 0,00
                </Text>
              </Box>
            </Stack>
          </Box>
          <Box mt="4" border="1px solid #E5E5E5" borderRadius="lg" p="4">
            <SectionTitle mt="0" fontWeight="700">
              {t('Desempenho na última semana')}
            </SectionTitle>
            <Text mt="1" fontSize="xs">
              {t('Período 19/07 a 25/07')}
            </Text>
            <Stack mt="3" direction={{ base: 'column', md: 'row' }} spacing={2}>
              <Box
                h="132px"
                py="4"
                px="6"
                border="1px solid #E5E5E5"
                borderRadius="lg"
                alignItems="flex-start"
              >
                <Text fontSize="15px" lineHeight="21px">
                  {t('Total de pedidos')}
                </Text>
                <Text mt="1" color="black" minW="140px" fontSize="2xl" lineHeight="30px">
                  100 pedidos
                </Text>
                <Text mt="1" fontSize="md" lineHeight="22px">
                  R$ 0,00
                </Text>
              </Box>
              <Box
                h="132px"
                py="4"
                px="6"
                border="1px solid #E5E5E5"
                borderRadius="lg"
                alignItems="flex-start"
              >
                <Text fontSize="15px" lineHeight="21px">
                  {t('Prato mais vendido')}
                </Text>
                <Text mt="1" color="black" fontSize="md" lineHeight="22px">
                  Nome do prato
                </Text>
              </Box>
              <Box
                h="132px"
                py="4"
                px="6"
                border="1px solid #E5E5E5"
                borderRadius="lg"
                alignItems="flex-start"
              >
                <Text fontSize="15px" lineHeight="21px">
                  {t('Semana anterior')}
                </Text>
                <Text fontSize="15px" lineHeight="21px">
                  {t('(12/07 a 18/07)')}
                </Text>
                <Text mt="1" color="black" minW="140px" fontSize="2xl" lineHeight="30px">
                  100 pedidos
                </Text>
                <Text mt="1" color="black" fontSize="sm" lineHeight="22px">
                  +R$ 0,00
                  <Text pl="2" as="span" color="gray.700">
                    {'(+0%)'}
                  </Text>
                </Text>
              </Box>
            </Stack>
          </Box>
        </Box>
      ) : (
        <RegistrationStatus />
      )}
    </>
  );
};

export default Dashboard;
