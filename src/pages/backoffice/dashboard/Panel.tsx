import { Box, Flex, HStack, Skeleton, Text } from '@chakra-ui/react';
import { useContextBackofficeDashboard } from 'app/state/dashboards/backoffice';
import I18n from 'i18n-js';
import React from 'react';
import { formatCurrency } from 'utils/formatters';
import { t } from 'utils/i18n';

interface BOInfoBoxProps {
  title: string;
  value?: number;
  isCurrency?: boolean;
}

const BOInfoBox = ({ title, value, isCurrency }: BOInfoBoxProps) => {
  // handlers
  const formatValue = (value: number) => {
    const zeros = 4 - value.toString().length;
    if (zeros > 0) return `${'0'.repeat(zeros)}${value}`;
    return value.toString();
  };
  //UI
  return (
    <Box w="142px">
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
  const {
    todayOrders,
    todayDeliveredOrders,
    todayAverage,
    couriers,
    businesses,
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
      mt="10"
      flexDir={{ base: 'column', md: 'row' }}
      justifyContent="space-between"
      border="1px solid #F6F6F6"
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
          <BOInfoBox title={t('Pedidos criados')} value={todayOrders} />
          <BOInfoBox title={t('Pedidos entregues')} value={todayDeliveredOrders} />
        </HStack>
        <HStack mt="4" spacing={6}>
          <BOInfoBox title={t('Ticket médio')} value={todayAverage} isCurrency />
          <BOInfoBox title={t('Entregadores ativos')} value={couriers} />
        </HStack>
        <HStack mt="4" spacing={6}>
          <BOInfoBox title={t('Restaurantes abertos')} value={businesses} />
          <BOInfoBox title={t('Clientes novos')} value={consumers} />
        </HStack>
      </Box>
    </Flex>
  );
};
