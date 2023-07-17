import { Order, WithId } from '@appjusto/types';
import { Box, Button, Flex, HStack, Progress, Text } from '@chakra-ui/react';
import { useOrdersContext } from 'app/state/order';
import { useContextServerTime } from 'app/state/server-time';
import { useContextStaffProfile } from 'app/state/staff/context';
import { ReactComponent as Alarm } from 'common/img/alarm_outlined.svg';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';

interface Props {
  order: WithId<Order>;
}

export const OrderPreparingCard = ({ order }: Props) => {
  // context
  const { url } = useRouteMatch();
  const { getServerTime } = useContextServerTime();
  const { business, changeOrderStatus } = useOrdersContext();
  const { isBackofficeUser } = useContextStaffProfile();
  // state
  const [elapsedTime, setElapsedTime] = React.useState<number | null>(0);
  // helpers
  const preparingAt = React.useMemo(() => {
    return order.timestamps.preparing
      ? (order.timestamps.preparing as Timestamp).toDate()
      : null;
  }, [order.timestamps.preparing]);
  const isCookingTimeModeAuto = business?.settings?.cookingTimeMode === 'auto';
  const consumerName = React.useMemo(
    () => (order.consumer.name ? order.consumer.name.split(' ')[0] : 'N/E'),
    [order.consumer.name]
  );
  const cookingTime = React.useMemo(
    () => (order?.cookingTime ? order?.cookingTime / 60 : null),
    [order?.cookingTime]
  );
  const cookingProgress = React.useMemo(
    () => (cookingTime && elapsedTime ? (elapsedTime / cookingTime) * 100 : 0),
    [cookingTime, elapsedTime]
  );
  // side effects
  React.useEffect(() => {
    const setNewTime = () => {
      if (preparingAt) {
        const time = dayjs().diff(preparingAt, 'minute');
        setElapsedTime(time);
      } else {
        setElapsedTime(null);
      }
    };
    setNewTime();
    const timeInterval = setInterval(setNewTime, 60000);
    return () => clearInterval(timeInterval);
  }, [getServerTime, preparingAt]);
  React.useEffect(() => {
    // disabled for backoffice users
    if (isBackofficeUser) return;
    // automatic order status change
    if (elapsedTime && cookingTime && elapsedTime >= cookingTime) {
      changeOrderStatus(order.id, 'ready');
    }
  }, [order.id, elapsedTime, changeOrderStatus, cookingTime, isBackofficeUser]);
  // UI
  return (
    <Box
      position="relative"
      borderRadius="lg"
      borderColor="black"
      borderWidth="2px"
      color="black"
      boxShadow="0px 8px 16px -4px rgba(105,118,103,0.1)"
    >
      <Link to={`${url}/${order.id}`}>
        <Box
          w="100%"
          h="100%"
          px="4"
          pt="4"
          pb={isCookingTimeModeAuto ? '4' : '58px'}
        >
          <Flex flexDir="column" fontWeight="700">
            <Flex justifyContent="space-between">
              <Box maxW="90px">
                <Text fontSize="lg" fontWeight="700">
                  #{order.code}
                </Text>
                <Text fontSize="xs" lineHeight="lg" fontWeight="500">
                  {`{${consumerName}}`}
                </Text>
              </Box>
              <Flex flexDir="column">
                <HStack spacing={2} justifyContent="space-between">
                  <HStack spacing={1}>
                    <Alarm />
                    <Text fontSize="xs">{elapsedTime ?? 0} min</Text>
                  </HStack>
                  <Text fontSize="xs" color="gray.700">
                    {cookingTime ? `${cookingTime} min` : 'N/I'}
                  </Text>
                </HStack>
                <Progress
                  mt="1"
                  ml="22px"
                  w="80px"
                  size="sm"
                  value={cookingProgress}
                  colorScheme="green"
                  borderRadius="lg"
                />
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </Link>
      <Box
        position="absolute"
        w="100%"
        bottom="0"
        px="4"
        mb="4"
        zIndex="999"
        display={isCookingTimeModeAuto ? 'none' : 'block'}
      >
        <Button
          mt="3"
          w="full"
          maxH="34px"
          size="sm"
          fontSize="xs"
          onClick={() => changeOrderStatus(order.id, 'ready')}
        >
          {t('Pedido pronto')}
        </Button>
      </Box>
    </Box>
  );
};
