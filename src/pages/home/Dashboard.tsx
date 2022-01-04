import { Box, BoxProps, Circle, HStack, Skeleton, Stack, Text } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import { useContextBusinessDashboard } from 'app/state/dashboards/business';
import { CrowdfundingCard } from 'common/components/CrowdfundingCard';
import { MaintenanceBox } from 'common/components/MaintenanceBox';
import { NewFeatureBox } from 'common/components/NewFeatureBox';
import I18n from 'i18n-js';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import React from 'react';
import { BsShare } from 'react-icons/bs';
import { useRouteMatch } from 'react-router';
import { formatCurrency, formatPct } from 'utils/formatters';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../PageHeader';
import { LineChart } from './LineChart';
import { RegistrationStatus } from './RegistrationStatus';

interface InfoBoxProps extends BoxProps {
  isJoined?: boolean;
  data?: any;
  title: string;
  titleColor?: string;
  circleBg?: string;
  children: React.ReactNode | React.ReactNode[];
}

const InfoBox = ({
  isJoined,
  data,
  title,
  titleColor = '#505A4F',
  circleBg,
  children,
  ...props
}: InfoBoxProps) => {
  if (isJoined)
    return (
      <Box {...props}>
        <Text color={titleColor} fontSize="15px" lineHeight="21px">
          {title}
        </Text>
        {data !== undefined ? (
          children
        ) : (
          <Box>
            <Skeleton mt="1" height="30px" colorScheme="#9AA49C" />
            <Skeleton mt="2" height="20px" mr="4" colorScheme="#9AA49C" />
          </Box>
        )}
      </Box>
    );
  return (
    <Box
      w={{ base: '100%', lg: '190px' }}
      h="132px"
      py="4"
      px="6"
      border="1px solid #E5E5E5"
      borderRadius="lg"
      alignItems="flex-start"
      {...props}
    >
      <HStack ml={circleBg ? '-16px' : '0'}>
        {circleBg && <Circle size="8px" bg={circleBg} />}
        <Text color={titleColor} fontSize="15px" lineHeight="21px">
          {title}
        </Text>
      </HStack>
      {data !== undefined ? (
        children
      ) : (
        <Box>
          <Skeleton mt="1" height="30px" colorScheme="#9AA49C" fadeDuration={0.2} />
          <Skeleton mt="2" height="20px" mr="4" colorScheme="#9AA49C" fadeDuration={0.2} />
        </Box>
      )}
    </Box>
  );
};

const Dashboard = () => {
  // context
  const { path } = useRouteMatch();
  const { business, isDeleted, setIsDeleted } = useContextBusiness();
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
    currentWeekByDay,
    lastWeekOrders,
    lastWeekValue,
    lastWeekByDay,
  } = useContextBusinessDashboard();
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [currentMonth, setCurrentMonth] = React.useState('');
  // helpers
  const getRevenueDifference = () => {
    let sign = '';
    if (currentWeekValue === undefined || lastWeekValue === undefined) return 'R$ 0,00';
    if (currentWeekValue > lastWeekValue) sign = '+';
    let result = formatCurrency(currentWeekValue - lastWeekValue);
    return `${sign} ${result}`;
  };
  const getDifferencePercentage = () => {
    let sign = '';
    if (
      currentWeekValue === undefined ||
      lastWeekValue === undefined ||
      (lastWeekValue === 0 && currentWeekValue === 0)
    )
      return '(0%)';
    if (currentWeekValue > lastWeekValue) sign = '+';
    else sign = '-';
    let result = formatPct(
      Math.abs(
        (currentWeekValue - lastWeekValue) / (lastWeekValue > 0 ? lastWeekValue : currentWeekValue)
      )
    );
    return `${sign} (${result})`;
  };
  const showChart = currentWeekOrders! > 0 || lastWeekOrders! > 0;
  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
    setCurrentMonth(I18n.strftime(new Date(), '%B'));
  }, []);
  React.useEffect(() => {
    if (isDeleted) {
      setIsDeleted(false);
    }
  }, [isDeleted, setIsDeleted]);
  // UI
  return (
    <>
      <PageHeader
        title={t('Início')}
        subtitle={t(`Dados atualizados em ${dateTime}`)}
        showVersion
      />
      {business?.situation === 'approved' ? (
        <Box>
          <MaintenanceBox />
          <CrowdfundingCard />
          <NewFeatureBox
            icon={BsShare}
            title={t('Compartilhe seu restaurante como quiser!')}
            description={t(
              'Agora no AppJusto, você pode criar links diferentes para os seus clientes realizarem os pedidos: direto no app, pelo WhatsApp, ou apenas visualizar o cardápio na loja!'
            )}
            link={`${path}/sharing`}
            btnLabel={t('Visualizar links')}
            isNew={false}
          />
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
                <InfoBox
                  minW="140px"
                  isJoined
                  data={todayOrders}
                  title={t('Pedidos/ Hoje')}
                  titleColor="green.600"
                >
                  <Text mt="1" color="black" minW="140px" fontSize="2xl" lineHeight="30px">
                    {`${todayOrders ?? 'N/E'} pedidos`}
                  </Text>
                  <Text mt="1" fontSize="md" lineHeight="22px">
                    {todayValue !== undefined ? formatCurrency(todayValue) : 'N/E'}
                  </Text>
                </InfoBox>
                <InfoBox
                  isJoined
                  data={todayAverage}
                  title={t('Ticket médio/ Hoje')}
                  titleColor="green.600"
                >
                  <Text mt="1" color="black" fontSize="2xl" lineHeight="30px">
                    {todayAverage ? formatCurrency(todayAverage) : 'R$ 0,00'}
                  </Text>
                </InfoBox>
              </Stack>
              <Stack direction={{ base: 'column', md: 'row' }}>
                <InfoBox data={monthOrders} title={t(`Pedidos/ ${currentMonth}`)}>
                  <Text mt="1" color="black" minW="140px" fontSize="2xl" lineHeight="30px">
                    {`${monthOrders ?? 'N/E'} pedidos`}
                  </Text>
                  <Text mt="1" fontSize="md" lineHeight="22px">
                    {monthValue ? formatCurrency(monthValue) : 'R$ 0,00'}
                  </Text>
                </InfoBox>
                <InfoBox data={monthAverage} title={t(`Ticket médio/ ${currentMonth}`)}>
                  <Text mt="1" color="black" fontSize="2xl" lineHeight="30px">
                    {monthAverage ? formatCurrency(monthAverage) : 'R$ 0,00'}
                  </Text>
                </InfoBox>
              </Stack>
            </Stack>
          </Box>
          <Box mt="4" border="1px solid #E5E5E5" borderRadius="lg" p="4">
            <SectionTitle mt="0" fontWeight="700">
              {t('Desempenho esta semana')}
            </SectionTitle>
            <Stack mt="4" direction={{ base: 'column', lg: 'row' }} spacing={2}>
              <Stack w="100%" direction={{ base: 'column', md: 'row' }}>
                <InfoBox
                  w="100%"
                  data={currentWeekOrders}
                  title={t('Total de pedidos')}
                  circleBg="green.600"
                >
                  <Text mt="1" color="black" minW="140px" fontSize="2xl" lineHeight="30px">
                    {`${currentWeekOrders ?? 'N/E'} pedidos`}
                  </Text>
                  <Text mt="1" fontSize="md" lineHeight="22px">
                    {currentWeekValue ? formatCurrency(currentWeekValue) : 'R$ 0,00'}
                  </Text>
                </InfoBox>
                <InfoBox w="100%" data={currentWeekAverage} title={t('Ticket médio')}>
                  <Text mt="1" color="black" fontSize="2xl" lineHeight="30px">
                    {currentWeekAverage ? formatCurrency(currentWeekAverage) : 'R$ 0,00'}
                  </Text>
                </InfoBox>
              </Stack>
              <Stack w="100%" direction={{ base: 'column', md: 'row' }}>
                <InfoBox w="100%" data={currentWeekProduct} title={t('Prato mais vendido')}>
                  <Text mt="1" color="black" fontSize="md" lineHeight="22px">
                    {currentWeekProduct}
                  </Text>
                </InfoBox>

                <InfoBox
                  w="100%"
                  data={lastWeekOrders}
                  title={t('Semana anterior')}
                  circleBg="gray.500"
                >
                  <Text mt="1" color="black" minW="140px" fontSize="2xl" lineHeight="30px">
                    {`${lastWeekOrders ?? 'N/E'} pedidos`}
                  </Text>
                  <Text mt="1" color="black" fontSize="sm" lineHeight="22px">
                    {getRevenueDifference()}
                    <Text pl="2" as="span" color="gray.700">
                      {getDifferencePercentage()}
                    </Text>
                  </Text>
                </InfoBox>
              </Stack>
            </Stack>
            {showChart && (
              <LineChart currentWeekData={currentWeekByDay!} lastWeekData={lastWeekByDay!} />
            )}
          </Box>
        </Box>
      ) : (
        <RegistrationStatus />
      )}
    </>
  );
};

export default Dashboard;
