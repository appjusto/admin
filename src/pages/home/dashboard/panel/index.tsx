import { Box, Stack, Text } from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import { useContextBusinessDashboard } from 'app/state/dashboards/business';
import { MaintenanceBox } from 'common/components/MaintenanceBox';
import I18n from 'i18n-js';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import React from 'react';
import { formatCurrency, formatPct } from 'utils/formatters';
import { t } from 'utils/i18n';
import BannersContainer from './banners/BannersContainer';
import InfoBox from './InfoBox';
import { InsuranceModal } from './InsuranceModal';
import LineChart from './LineChart';

export const Panel = () => {
  // context
  const { adminRole } = useContextFirebaseUser();
  const { business, banners } = useContextBusiness();
  const {
    todayCount,
    todayValue,
    todayAverage,
    currentWeekProduct,
    monthCount,
    monthValue,
    monthAverage,
    currentWeekCount,
    currentWeekValue,
    currentWeekAverage,
    currentWeekByDay,
    lastWeekCount,
    lastWeekValue,
    lastWeekByDay,
  } = useContextBusinessDashboard();
  // state
  const [currentMonth, setCurrentMonth] = React.useState('');
  // helpers
  const getRevenueDifference = React.useCallback(() => {
    let sign = '';
    if (currentWeekValue === undefined || lastWeekValue === undefined)
      return 'R$ 0,00';
    if (currentWeekValue > lastWeekValue) sign = '+';
    let result = formatCurrency(currentWeekValue - lastWeekValue);
    return `${sign} ${result}`;
  }, [currentWeekValue, lastWeekValue]);
  const getDifferencePercentage = React.useCallback(() => {
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
        (currentWeekValue - lastWeekValue) /
          (lastWeekValue > 0 ? lastWeekValue : currentWeekValue)
      )
    );
    return `${sign} (${result})`;
  }, [currentWeekValue, lastWeekValue]);
  const showChart = React.useMemo(
    () => currentWeekCount! > 0 || lastWeekCount! > 0,
    [currentWeekCount, lastWeekCount]
  );
  const insuranceModalIsOpen = React.useMemo(() => {
    const isUserTarget = adminRole === 'owner' || adminRole === 'manager';
    const insurance = business?.services?.find(
      (service) => service.name === 'insurance'
    );
    return (
      isUserTarget && !insurance && !business?.settings?.acknowledgeInsurance
    );
  }, [adminRole, business?.services, business?.settings?.acknowledgeInsurance]);
  // side effects
  React.useEffect(() => {
    setCurrentMonth(I18n.strftime(new Date(), '%B'));
  }, []);
  // UI
  return (
    <Box>
      <MaintenanceBox />
      <BannersContainer banners={banners} />
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
              data={todayCount}
              title={t('Pedidos/ Hoje')}
              titleColor="green.600"
            >
              <Text
                mt="1"
                color="black"
                minW="140px"
                fontSize="2xl"
                lineHeight="30px"
              >
                {`${todayCount ?? 'N/E'} pedidos`}
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
            <InfoBox data={monthCount} title={t(`Pedidos/ ${currentMonth}`)}>
              <Text
                mt="1"
                color="black"
                minW="140px"
                fontSize="2xl"
                lineHeight="30px"
              >
                {`${monthCount ?? 'N/E'} pedidos`}
              </Text>
              <Text mt="1" fontSize="md" lineHeight="22px">
                {monthValue ? formatCurrency(monthValue) : 'R$ 0,00'}
              </Text>
            </InfoBox>
            <InfoBox
              data={monthAverage}
              title={t(`Ticket médio/ ${currentMonth}`)}
            >
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
              data={currentWeekCount}
              title={t('Total de pedidos')}
              circleBg="green.600"
            >
              <Text
                mt="1"
                color="black"
                minW="140px"
                fontSize="2xl"
                lineHeight="30px"
              >
                {`${currentWeekCount ?? 'N/E'} pedidos`}
              </Text>
              <Text mt="1" fontSize="md" lineHeight="22px">
                {currentWeekValue
                  ? formatCurrency(currentWeekValue)
                  : 'R$ 0,00'}
              </Text>
            </InfoBox>
            <InfoBox
              w="100%"
              data={currentWeekAverage}
              title={t('Ticket médio')}
            >
              <Text mt="1" color="black" fontSize="2xl" lineHeight="30px">
                {currentWeekAverage
                  ? formatCurrency(currentWeekAverage)
                  : 'R$ 0,00'}
              </Text>
            </InfoBox>
          </Stack>
          <Stack w="100%" direction={{ base: 'column', md: 'row' }}>
            <InfoBox
              w="100%"
              data={currentWeekProduct}
              title={t('Prato mais vendido')}
            >
              <Text mt="1" color="black" fontSize="md" lineHeight="22px">
                {currentWeekProduct}
              </Text>
            </InfoBox>

            <InfoBox
              w="100%"
              data={lastWeekCount}
              title={t('Semana anterior')}
              circleBg="gray.500"
            >
              <Text
                mt="1"
                color="black"
                minW="140px"
                fontSize="2xl"
                lineHeight="30px"
              >
                {`${lastWeekCount ?? 'N/E'} pedidos`}
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
          <LineChart
            currentWeekData={currentWeekByDay!}
            lastWeekData={lastWeekByDay!}
          />
        )}
      </Box>
      <InsuranceModal isOpen={insuranceModalIsOpen} />
    </Box>
  );
};
