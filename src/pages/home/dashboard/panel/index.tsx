import { Box, Flex, Stack, Text, Tooltip } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import { useContextBusinessDashboard } from 'app/state/dashboards/business';
import { MaintenanceBox } from 'common/components/MaintenanceBox';
import I18n from 'i18n-js';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import React from 'react';
import { MdOutlineInfo } from 'react-icons/md';
import { formatCurrency, formatPct } from 'utils/formatters';
import { t } from 'utils/i18n';
import { SupportMaterials } from '../communication/SupportMaterials';
import BannersContainer from './banners/BannersContainer';
import InfoBox from './InfoBox';
import LineChart from './LineChart';

export const Panel = () => {
  // context
  const { banners } = useContextBusiness();
  const {
    todayCount,
    todayValue,
    todayAverage,
    todayCanceledCount,
    todayCanceledValue,
    todayInactivityCount,
    todayInactivityValue,
    currentWeekProduct,
    monthCount,
    monthValue,
    monthAverage,
    monthCanceledCount,
    monthCanceledValue,
    monthInactivityCount,
    monthInactivityValue,
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
  // side effects
  React.useEffect(() => {
    setCurrentMonth(I18n.strftime(new Date(), '%B'));
  }, []);
  // UI
  return (
    <Box mt="6">
      <MaintenanceBox />
      <BannersContainer banners={banners} />
      <Box mt="8" border="1px solid #E5E5E5" borderRadius="lg" p="4">
        <SectionTitle mt="0" fontWeight="700">
          {t('Acompanhamento diário')}
        </SectionTitle>
        <Stack mt="4" direction={{ base: 'column', lg: 'row' }} spacing={2}>
          <Stack
            minW={{ lg: '354px' }}
            h={{ base: 'auto', md: '132px' }}
            py="4"
            px="6"
            bgColor="#F2FFE8"
            borderRadius="lg"
            alignItems="flex-start"
            direction={{ base: 'column', md: 'row' }}
            spacing={6}
          >
            <InfoBox
              minW="140px"
              isJoined
              isLoading={todayCount === undefined}
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
              isLoading={todayAverage === undefined}
              title={t('Ticket médio/ Hoje')}
              titleColor="green.600"
            >
              <Text mt="1" color="black" fontSize="2xl" lineHeight="30px">
                {todayAverage ? formatCurrency(todayAverage) : 'R$ 0,00'}
              </Text>
            </InfoBox>
          </Stack>
          <Stack
            minW={{ lg: '354px' }}
            h={{ base: 'auto', md: '132px' }}
            py="4"
            px="6"
            bgColor="#FFF8F8"
            borderRadius="lg"
            alignItems="flex-start"
            direction={{ base: 'column', md: 'row' }}
            spacing={6}
          >
            <InfoBox
              minW="140px"
              isJoined
              isLoading={todayCanceledCount === undefined}
              title={t('Cancelados/ Hoje')}
              titleColor="red"
            >
              <Text
                mt="1"
                color="black"
                minW="140px"
                fontSize="2xl"
                lineHeight="30px"
              >
                {`${todayCanceledCount ?? 'N/E'} pedidos`}
              </Text>
              <Text mt="1" fontSize="md" lineHeight="22px">
                {todayCanceledValue !== undefined
                  ? formatCurrency(todayCanceledValue)
                  : 'N/E'}
              </Text>
            </InfoBox>
            <Flex>
              <InfoBox
                isJoined
                isLoading={todayAverage === undefined}
                title={t('Por inatividade')}
                titleColor="red"
              >
                <Text
                  mt="1"
                  color="black"
                  minW="140px"
                  fontSize="2xl"
                  lineHeight="30px"
                >
                  {`${todayInactivityCount ?? 'N/E'} pedidos`}
                </Text>
                <Text mt="1" fontSize="md" lineHeight="22px">
                  {todayInactivityValue !== undefined
                    ? formatCurrency(todayInactivityValue)
                    : 'N/E'}
                </Text>
              </InfoBox>
              <Box ml="-4">
                <Tooltip
                  placement="top"
                  label={t(
                    'Pedidos cancelados após excederem o tempo limite para o aceite do restaurante'
                  )}
                  aria-label={t('cancelados-por-inatividade')}
                >
                  <Box>
                    <MdOutlineInfo />
                  </Box>
                </Tooltip>
              </Box>
            </Flex>
          </Stack>
        </Stack>
        <Stack mt="2" direction={{ base: 'column', lg: 'row' }} spacing={2}>
          <Stack
            minW={{ lg: '354px' }}
            h={{ base: 'auto', md: '132px' }}
            py="4"
            px="6"
            bgColor="#F6F6F6"
            borderRadius="lg"
            alignItems="flex-start"
            direction={{ base: 'column', md: 'row' }}
            spacing={6}
          >
            <InfoBox
              isJoined
              isLoading={monthCount === undefined}
              title={t(`Pedidos/ ${currentMonth}`)}
            >
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
              isJoined
              isLoading={monthAverage === undefined}
              title={t(`Ticket médio/ ${currentMonth}`)}
            >
              <Text mt="1" color="black" fontSize="2xl" lineHeight="30px">
                {monthAverage ? formatCurrency(monthAverage) : 'R$ 0,00'}
              </Text>
            </InfoBox>
          </Stack>
          <Stack
            minW={{ lg: '354px' }}
            h={{ base: 'auto', md: '132px' }}
            py="4"
            px="6"
            bgColor="#F6F6F6"
            borderRadius="lg"
            alignItems="flex-start"
            direction={{ base: 'column', md: 'row' }}
            spacing={6}
          >
            <InfoBox
              isJoined
              isLoading={monthCanceledCount === undefined}
              title={t(`Cancelados/ ${currentMonth}`)}
            >
              <Text
                mt="1"
                color="black"
                minW="140px"
                fontSize="2xl"
                lineHeight="30px"
              >
                {`${monthCanceledCount ?? 'N/E'} pedidos`}
              </Text>
              <Text mt="1" fontSize="md" lineHeight="22px">
                {monthCanceledValue
                  ? formatCurrency(monthCanceledValue)
                  : 'R$ 0,00'}
              </Text>
            </InfoBox>
            <InfoBox
              isJoined
              isLoading={monthAverage === undefined}
              title={t(`Por inatividade`)}
            >
              <Text
                mt="1"
                color="black"
                minW="140px"
                fontSize="2xl"
                lineHeight="30px"
              >
                {`${monthInactivityCount ?? 'N/E'} pedidos`}
              </Text>
              <Text mt="1" fontSize="md" lineHeight="22px">
                {monthInactivityValue
                  ? formatCurrency(monthInactivityValue)
                  : 'R$ 0,00'}
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
              isLoading={currentWeekCount === undefined}
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
              isLoading={currentWeekAverage === undefined}
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
              isLoading={currentWeekProduct === undefined}
              title={t('Prato mais vendido')}
            >
              <Text mt="1" color="black" fontSize="md" lineHeight="22px">
                {currentWeekProduct}
              </Text>
            </InfoBox>

            <InfoBox
              w="100%"
              isLoading={lastWeekCount === undefined}
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
      <SupportMaterials />
    </Box>
  );
};
