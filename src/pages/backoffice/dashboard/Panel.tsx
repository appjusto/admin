import { Box, Flex, HStack, Skeleton, Text } from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBackofficeDashboard } from 'app/state/dashboards/backoffice';
import I18n from 'i18n-js';
import React from 'react';
import { formatCurrency } from 'utils/formatters';
import { t } from 'utils/i18n';

interface BOInfoBoxProps {
  title: string;
  value?: number;
  isCurrency?: boolean;
  isDisplayed?: boolean;
}

const BOInfoBox = ({ title, value, isCurrency, isDisplayed }: BOInfoBoxProps) => {
  // handlers
  const formatValue = (value: number) => {
    const zeros = 4 - value.toString().length;
    if (zeros > 0) return `${'0'.repeat(zeros)}${value}`;
    return value.toString();
  };
  //UI
  return (
    <Box display={isDisplayed ? 'block' : 'none'} w="142px">
      <Text fontSize="sm" lineHeight="21px" color="gray.700">
        {title}
      </Text>
      {value !== undefined ? (
        <Text mt="2" fontSize="2xl" lineHeight="28.8px">
          {isCurrency ? formatCurrency(value) : formatValue(value)}
        </Text>
      ) : (
        <Skeleton mt="1" height="30px" colorScheme="#9AA49C" />
      )}
    </Box>
  );
};

export const Panel = () => {
  // context
  const { userAbility } = useContextFirebaseUser();
  const {
    statistics,
    todayOrders,
    todayDeliveredOrders,
    todayAverage,
    couriers,
    businessesNumber,
    consumers,
  } = useContextBackofficeDashboard();
  // state
  const [weekDay, setWeekDay] = React.useState<string>();
  const [date, setDate] = React.useState<string>();
  // side effects
  React.useEffect(() => {
    const today = new Date();
    const day = I18n.strftime(today, '%A').toLowerCase();
    const dayName = ['sábado', 'domingo'].includes(day) ? day : `${day}-feira`;
    const month = I18n.strftime(today, '%B').toLowerCase();
    setWeekDay(dayName);
    setDate(`${today.getDate()} de ${month} de ${today.getFullYear()}`);
  }, []);
  // UI
  return (
    <Flex
      mt="6"
      flexDir={{ base: 'column', md: 'row' }}
      justifyContent="space-between"
      border="1px solid #E5E5E5"
      borderRadius="lg"
      p="8"
      color="black"
    >
      <Box>
        <Text fontSize="2xl" fontWeight="700" lineHeight="28.8px">
          {t(`Hoje, ${weekDay}!`)}
        </Text>
        <Text mt="2" fontSize="sm" fontWeight="500" lineHeight="21px" color="green.600">
          {date}
        </Text>
        <HStack mt="4" spacing={6}>
          <BOInfoBox
            isDisplayed={userAbility?.can('read', 'orders')}
            title={t('Pedidos criados')}
            value={todayOrders}
          />
          <BOInfoBox
            isDisplayed={userAbility?.can('read', 'orders')}
            title={t('Pedidos entregues')}
            value={todayDeliveredOrders}
          />
        </HStack>
        <HStack mt="4" spacing={6}>
          <BOInfoBox
            isDisplayed={userAbility?.can('read', 'orders')}
            title={t('Ticket médio')}
            value={todayAverage}
            isCurrency
          />
          <BOInfoBox
            isDisplayed={userAbility?.can('read', 'couriers')}
            title={t('Entregadores ativos')}
            value={couriers}
          />
        </HStack>
        <HStack mt="4" spacing={6}>
          <BOInfoBox
            isDisplayed={userAbility?.can('read', 'businesses')}
            title={t('Restaurantes abertos')}
            value={businessesNumber}
          />
          <BOInfoBox
            isDisplayed={userAbility?.can('read', 'consumers')}
            title={t('Clientes novos')}
            value={consumers}
          />
        </HStack>
      </Box>
      <Box mt={{ base: '8', md: '0' }}>
        <Text fontSize="2xl" fontWeight="700" lineHeight="28.8px">
          {t('Geral')}
        </Text>
        <Text mt="2" fontSize="sm" fontWeight="500" lineHeight="21px" color="green.600">
          {t('Números totais do Appjusto')}
        </Text>
        <HStack mt="4" spacing={6}>
          {/*<BOInfoBox title={t('Rest. aprovados')} value={businesses} />*/}
          <BOInfoBox
            isDisplayed
            title={t('Entreg. aprovados')}
            value={statistics?.couriers?.totalApproved}
          />
          <BOInfoBox
            isDisplayed
            title={t('Comida entregues')}
            value={statistics?.food?.totalOrders}
          />
        </HStack>
        {/*<HStack mt="4" spacing={6}>
          <BOInfoBox isDisplayed title={t('Clientes ativos')} value={consumers} />
        </HStack>*/}
        <HStack mt="4" spacing={6}>
          <BOInfoBox isDisplayed title={t('P2P entregues')} value={statistics?.p2p?.totalOrders} />
          <BOInfoBox
            isDisplayed
            title={t('Ticket médio')}
            value={statistics?.food?.averageTicketPrice}
            isCurrency
          />
        </HStack>
      </Box>
    </Flex>
  );
};
