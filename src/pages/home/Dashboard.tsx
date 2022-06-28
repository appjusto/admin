import { Box, BoxProps, Circle, HStack, Link, Skeleton, Stack, Text } from '@chakra-ui/react';
import { isElectron } from '@firebase/util';
import { useContextBusiness } from 'app/state/business/context';
import { useContextBusinessDashboard } from 'app/state/dashboards/business';
import { MaintenanceBox } from 'common/components/MaintenanceBox';
import { NewFeatureBox } from 'common/components/NewFeatureBox';
import { ReactComponent as ExtensionIcon } from 'common/img/chrome-extension-icon.svg';
import I18n from 'i18n-js';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import React from 'react';
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
  const { business } = useContextBusiness();
  const {
    todayInvoices,
    todayValue,
    todayAverage,
    monthInvoices,
    monthValue,
    monthAverage,
    currentWeekInvoices,
    currentWeekValue,
    currentWeekAverage,
    currentWeekProduct,
    currentWeekByDay,
    lastWeekInvoices,
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
  const showChart = currentWeekInvoices! > 0 || lastWeekInvoices! > 0;
  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
    setCurrentMonth(I18n.strftime(new Date(), '%B'));
  }, []);
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
          {/* <NewFeatureBox
            icon={BsShare}
            title={t('Compartilhe seu restaurante como quiser!')}
            description={t(
              'Agora no AppJusto, você pode criar links diferentes para os seus clientes realizarem os pedidos: direto no app, pelo WhatsApp, ou apenas visualizar o cardápio na loja!'
            )}
            link={`${path}/sharing`}
            btnLabel={t('Visualizar links')}
            isNew={false}
          /> */}
          {
            !isElectron() && (
              <NewFeatureBox
                icon={ExtensionIcon}
                iconSize="lg"
                title={t('Extensão para Google Chrome')}
                description={t(
                  'Nova extensão Appjusto Admin para Google Chrome! Ela ajuda a manter sua aplicação sempre ativa para receber pedidos.'
                )}
                link="https://chrome.google.com/webstore/detail/appjusto-admin/mcmielagmkelelpmnmjlnlpeakdmmeap?hl=pt-br"
                btnLabel={t('Instalar')}
                btnVariant="solid"
                isExternal
                isNew
              />
            )
          }
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
                  data={todayInvoices}
                  title={t('Pedidos/ Hoje')}
                  titleColor="green.600"
                >
                  <Text mt="1" color="black" minW="140px" fontSize="2xl" lineHeight="30px">
                    {`${todayInvoices ?? 'N/E'} pedidos`}
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
                <InfoBox data={monthInvoices} title={t(`Pedidos/ ${currentMonth}`)}>
                  <Text mt="1" color="black" minW="140px" fontSize="2xl" lineHeight="30px">
                    {`${monthInvoices ?? 'N/E'} pedidos`}
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
                  data={currentWeekInvoices}
                  title={t('Total de pedidos')}
                  circleBg="green.600"
                >
                  <Text mt="1" color="black" minW="140px" fontSize="2xl" lineHeight="30px">
                    {`${currentWeekInvoices ?? 'N/E'} pedidos`}
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
                  data={lastWeekInvoices}
                  title={t('Semana anterior')}
                  circleBg="gray.500"
                >
                  <Text mt="1" color="black" minW="140px" fontSize="2xl" lineHeight="30px">
                    {`${lastWeekInvoices ?? 'N/E'} pedidos`}
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
