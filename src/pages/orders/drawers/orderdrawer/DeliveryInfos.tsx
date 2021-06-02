import { Box, Button, Circle, Flex, Image, Text } from '@chakra-ui/react';
import { useCourierProfilePicture } from 'app/api/courier/useCourierProfilePicture';
import { useOrderDeliveryInfos } from 'app/api/order/useOrderDeliveryInfos';
import { Order, WithId } from 'appjusto-types';
import I18n from 'i18n-js';
import React from 'react';
import { Link } from 'react-router-dom';
import { t } from 'utils/i18n';
import { DeliveryMap } from './DeliveryMap';

interface DeliveryInfosProps {
  order: WithId<Order>;
}

export const DeliveryInfos = ({ order }: DeliveryInfosProps) => {
  // context
  const courierPictureUrl = useCourierProfilePicture(order.courier?.id);
  const {
    isMatched,
    isCurrierArrived,
    orderDispatchingStatusText,
    arrivalTime,
  } = useOrderDeliveryInfos(order);
  // state
  const [joined, setJoined] = React.useState<string | null>();

  // side effects
  React.useEffect(() => {
    const date = order.courier?.joined as firebase.firestore.Timestamp;
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
          {orderDispatchingStatusText}
        </Text>
        {!isCurrierArrived &&
          arrivalTime &&
          (arrivalTime > 0 ? (
            <Text fontSize="sm">
              {t(
                `Chega em aproximadamente ${
                  arrivalTime > 1 ? arrivalTime + ' minutos' : arrivalTime + ' minuto'
                }`
              )}
            </Text>
          ) : (
            <Text fontSize="sm">{t(`Chega em menos de 1 minuto`)}</Text>
          ))}
      </Flex>
      {isMatched && (
        <Flex mt="4" justifyContent="space-between" alignItems="flex-end">
          <Flex alignItems="center" justifyContent="flex-end">
            <Box>
              {courierPictureUrl ? (
                <Image src={courierPictureUrl} width="48px" height="48px" borderRadius="24px" />
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
          <Link to={`/app/orders/chat/${order.id}/${order.courier?.id}`}>
            <Button variant="outline" size="sm">
              {t('Abrir chat com o entregador')}
            </Button>
          </Link>
        </Flex>
      )}
      <DeliveryMap key={order.id} order={order} />
      <Text mt="4" fontSize="xl" color="black">
        {t('Destino do pedido')}
      </Text>
      <Text fontSize="sm">{order.destination?.address.description}</Text>
    </Box>
  );
};
