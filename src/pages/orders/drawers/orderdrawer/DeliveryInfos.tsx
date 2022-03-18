import { Order, WithId } from '@appjusto/types';
import { Box, Button, Circle, Flex, HStack, Image, Text } from '@chakra-ui/react';
import { useCourierProfilePicture } from 'app/api/courier/useCourierProfilePicture';
import { useOrderDeliveryInfos } from 'app/api/order/useOrderDeliveryInfos';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextServerTime } from 'app/state/server-time';
import { AlertWarning } from 'common/components/AlertWarning';
import { Timestamp } from 'firebase/firestore';
import I18n from 'i18n-js';
import React from 'react';
import { Link } from 'react-router-dom';
import { t } from 'utils/i18n';
import { DeliveryMap } from './DeliveryMap';
interface DeliveryInfosProps {
  order: WithId<Order>;
  setOutsource?(value: boolean): void;
  isBackofficeDrawer?: boolean;
}

export const DeliveryInfos = ({
  order,
  setOutsource,
  isBackofficeDrawer = false,
}: DeliveryInfosProps) => {
  // context
  const { getServerTime } = useContextServerTime();
  const { isBackofficeUser } = useContextFirebaseUser();
  const courierPictureUrl = useCourierProfilePicture(order.courier?.id);
  const { isMatched, orderDispatchingText, arrivalTime, isNoMatch } = useOrderDeliveryInfos(
    getServerTime,
    order
  );
  // state
  const [joined, setJoined] = React.useState<string | null>();

  // helpers
  const showArrivalTime =
    isMatched &&
    typeof arrivalTime === 'number' &&
    order.dispatchingState !== 'arrived-pickup' &&
    order.dispatchingState !== 'arrived-destination';

  // side effects
  React.useEffect(() => {
    const date = order.courier?.joined as Timestamp;
    if (date) {
      try {
        const month = I18n.strftime(date.toDate(), '%B');
        const year = date.toDate().toString().split(' ')[3];
        const joinDate = `${month}, ${year}`;
        setJoined(joinDate);
      } catch (error) {
        console.log(error);
        setJoined(null);
      }
    }
  }, [order.courier]);

  // UI
  return (
    <Box mt="6">
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontSize="xl" color="black">
          {orderDispatchingText}
        </Text>
        {showArrivalTime &&
          (arrivalTime! > 0 ? (
            <Text fontSize="sm">
              {t(
                `Chega em aproximadamente ${
                  arrivalTime! > 1 ? arrivalTime + ' minutos' : arrivalTime + ' minuto'
                }`
              )}
            </Text>
          ) : (
            <Text fontSize="sm">{t(`Chega em menos de 1 minuto`)}</Text>
          ))}
        {isNoMatch && !isBackofficeUser && (
          <HStack spacing={2}>
            {/*<Button
              size="md"
              variant="yellowDark"
              onClick={() => setOutsource && setOutsource(true)}
            >
              {t('Assumir logística')}
            </Button>*/}
            <AlertWarning
              maxW="320px"
              fontSize="xs"
              description={t(
                'Não há entregadores disponíveis em nossa rede. Appjusto enviará um entregador de outra rede.'
              )}
              icon={false}
            />
          </HStack>
        )}
      </Flex>
      {isMatched && (
        <Flex
          mt="4"
          flexDir={{ base: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ base: 'flex-start', md: 'flex-end' }}
        >
          <Flex alignItems="center" justifyContent="flex-end">
            <Box minW="48px">
              {courierPictureUrl ? (
                <Image
                  src={courierPictureUrl}
                  width="48px"
                  height="48px"
                  borderRadius="24px"
                  ignoreFallback
                />
              ) : (
                <Circle size="48px" bg="gray.400" />
              )}
            </Box>
            <Flex ml="4" flexDir="column">
              <Text fontSize="xl" color="black">
                {order.courier?.name}
              </Text>
              {joined ? (
                <Text fontSize="sm">{t(`No appJusto desde ${joined}`)}</Text>
              ) : (
                <Text fontSize="sm" color="red">
                  {t('Não foi possível acessar data de cadastro.')}
                </Text>
              )}
            </Flex>
          </Flex>
          {!isBackofficeDrawer && (
            <Link to={`/app/orders/chat/${order.id}/${order.courier?.id}`}>
              <Button variant="outline" size="sm" mt={{ base: '4', md: '0' }}>
                {t('Abrir chat com o entregador')}
              </Button>
            </Link>
          )}
        </Flex>
      )}
      <DeliveryMap
        key={order.id}
        orderStatus={order.status}
        origin={order.origin?.location}
        destination={order.destination?.location}
        courier={order.courier?.location}
        orderPolyline={order.route?.polyline}
      />
      <Text mt="4" fontSize="xl" color="black">
        {t('Destino do pedido')}
      </Text>
      <Text fontSize="sm">{order.destination?.address.description}</Text>
    </Box>
  );
};
