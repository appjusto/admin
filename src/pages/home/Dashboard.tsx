import { Box, Circle, HStack, Stack, Text } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import { useContextBusinessDashboard } from 'app/state/dashboards/business';
import I18n from 'i18n-js';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import React from 'react';
import { defaults, Line } from 'react-chartjs-2';
import { formatCurrency, formatPct } from 'utils/formatters';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../PageHeader';
import { RegistrationStatus } from './RegistrationStatus';

const Dashboard = () => {
  // context
  const { business } = useContextBusiness();
  const {
    todayOrders,
    todayValue,
    todayAverage,
    monthOrders,
    monthValue,
    monthAverage,
    currentWeekOrders,
    currentWeekValue,
    currentWeekAverage,
    currentWeekProduct,
    lastWeekOrders,
    lastWeekValue,
  } = useContextBusinessDashboard();
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [currentMonth, setCurrentMonth] = React.useState('');
  const [chartLabels, setChartLabels] = React.useState<string[]>();
  // helpers
  const revenueDifference =
    currentWeekValue && lastWeekValue
      ? (currentWeekValue > lastWeekValue ? '+ ' : '') +
        formatCurrency(currentWeekValue - lastWeekValue)
      : 'N/E';
  const differencePercentage =
    currentWeekValue && lastWeekValue
      ? (currentWeekValue > lastWeekValue ? '+' : '-') +
        ` (${formatPct(Math.abs(currentWeekValue - lastWeekValue) / lastWeekValue)})`
      : 'N/E';
  // chart
  defaults.animation = false;
  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Semana atual',
        data: [12, 19, 3, 5, 2, 3, 4],
        fill: false,
        backgroundColor: '#4EA031',
        borderColor: '#4EA031',
      },
      {
        label: 'Semana passada',
        data: [8, 14, 8, 4, 2, 1, 2],
        fill: false,
        backgroundColor: '#C8D7CB',
        borderColor: '#C8D7CB',
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    maintainAspectRatio: false,
  };
  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
    setCurrentMonth(I18n.strftime(new Date(), '%B'));
  }, []);
  React.useEffect(() => {
    let today = new Date();
    let labels = [];
    for (let i = 0; i < 7; i++) {
      let pastDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      labels.push(I18n.strftime(pastDay, '%a'));
    }
    setChartLabels(labels.reverse());
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
            <Stack mt="4" direction={{ base: 'column', lg: 'row' }} spacing={2}>
              <Stack
                h={{ base: 'auto', md: '132px' }}
                py="4"
                px="6"
                border="1px solid #6CE787"
                borderRadius="lg"
                alignItems="flex-start"
                direction={{ base: 'column', md: 'row' }}
              >
                <Box>
                  <Text color="green.600" fontSize="15px" lineHeight="21px">
                    {t('Pedidos/ Hoje')}
                  </Text>
                  <Text mt="1" color="black" minW="140px" fontSize="2xl" lineHeight="30px">
                    {`${todayOrders ?? 'N/E'} pedidos`}
                  </Text>
                  <Text mt="1" fontSize="md" lineHeight="22px">
                    {todayValue ? formatCurrency(todayValue) : 'N/E'}
                  </Text>
                </Box>
                <Box>
                  <Text color="green.600" fontSize="15px" lineHeight="21px">
                    {t('Ticket médio/ Hoje')}
                  </Text>
                  <Text mt="1" color="black" fontSize="2xl" lineHeight="30px">
                    {todayAverage ? formatCurrency(todayAverage) : 'N/E'}
                  </Text>
                </Box>
              </Stack>
              <Stack direction={{ base: 'column', md: 'row' }}>
                <Box
                  w={{ base: '100%', lg: '190px' }}
                  h="132px"
                  py="4"
                  px="6"
                  border="1px solid #E5E5E5"
                  borderRadius="lg"
                  alignItems="flex-start"
                >
                  <Text fontSize="15px" lineHeight="21px">
                    {t(`Pedidos/ ${currentMonth}`)}
                  </Text>
                  <Text mt="1" color="black" minW="140px" fontSize="2xl" lineHeight="30px">
                    {`${monthOrders ?? 'N/E'} pedidos`}
                  </Text>
                  <Text mt="1" fontSize="md" lineHeight="22px">
                    {monthValue ? formatCurrency(monthValue) : 'N/E'}
                  </Text>
                </Box>
                <Box
                  w={{ base: '100%', lg: '190px' }}
                  h="132px"
                  py="4"
                  px="6"
                  border="1px solid #E5E5E5"
                  borderRadius="lg"
                  alignItems="flex-start"
                >
                  <Text fontSize="15px" lineHeight="21px">
                    {t(`Ticket médio/ ${currentMonth}`)}
                  </Text>
                  <Text mt="1" color="black" fontSize="2xl" lineHeight="30px">
                    {monthAverage ? formatCurrency(monthAverage) : 'N/E'}
                  </Text>
                </Box>
              </Stack>
            </Stack>
          </Box>
          <Box mt="4" border="1px solid #E5E5E5" borderRadius="lg" p="4">
            <SectionTitle mt="0" fontWeight="700">
              {t('Desempenho na última semana')}
            </SectionTitle>
            <Stack mt="4" direction={{ base: 'column', lg: 'row' }} spacing={2}>
              <Stack w="100%" direction={{ base: 'column', md: 'row' }}>
                <Box
                  w="100%"
                  h="132px"
                  py="4"
                  px="6"
                  border="1px solid #E5E5E5"
                  borderRadius="lg"
                  alignItems="flex-start"
                >
                  <HStack ml="-16px">
                    <Circle size="8px" bg="green.600" />
                    <Text fontSize="15px" lineHeight="21px">
                      {t('Total de pedidos')}
                    </Text>
                  </HStack>
                  <Text mt="1" color="black" minW="140px" fontSize="2xl" lineHeight="30px">
                    {`${currentWeekOrders ?? 'N/E'} pedidos`}
                  </Text>
                  <Text mt="1" fontSize="md" lineHeight="22px">
                    {currentWeekValue ? formatCurrency(currentWeekValue) : 'N/E'}
                  </Text>
                </Box>
                <Box
                  w="100%"
                  h="132px"
                  py="4"
                  px="6"
                  border="1px solid #E5E5E5"
                  borderRadius="lg"
                  alignItems="flex-start"
                >
                  <Text fontSize="15px" lineHeight="21px">
                    {t('Ticket médio')}
                  </Text>
                  <Text mt="1" color="black" fontSize="2xl" lineHeight="30px">
                    {currentWeekAverage ? formatCurrency(currentWeekAverage) : 'N/E'}
                  </Text>
                </Box>
              </Stack>
              <Stack w="100%" direction={{ base: 'column', md: 'row' }}>
                <Box
                  w="100%"
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
                    {currentWeekProduct ?? 'N/E'}
                  </Text>
                </Box>
                <Box
                  w="100%"
                  h="132px"
                  py="4"
                  px="6"
                  border="1px solid #E5E5E5"
                  borderRadius="lg"
                  alignItems="flex-start"
                >
                  <HStack ml="-16px">
                    <Circle size="8px" bg="gray.500" />
                    <Text fontSize="15px" lineHeight="21px">
                      {t('Semana anterior')}
                    </Text>
                  </HStack>
                  <Text mt="1" color="black" minW="140px" fontSize="2xl" lineHeight="30px">
                    {lastWeekOrders ? `${lastWeekOrders} pedidos` : 'N/E'}
                  </Text>
                  <Text mt="1" color="black" fontSize="sm" lineHeight="22px">
                    {revenueDifference}
                    <Text pl="2" as="span" color="gray.700">
                      {differencePercentage}
                    </Text>
                  </Text>
                </Box>
              </Stack>
            </Stack>
            <Box mt="4" position="relative" h="260px">
              <Line data={data} options={options} />
            </Box>
          </Box>
        </Box>
      ) : (
        <RegistrationStatus />
      )}
    </>
  );
};

export default Dashboard;
