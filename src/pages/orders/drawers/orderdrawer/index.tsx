import { Table, Tbody, Td, Text, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import { useOrder } from 'app/api/order/useOrder';
import { Issue, OrderIssue, OrderItem, WithId } from 'appjusto-types';
import { Pendency } from 'common/components/Pendency';
import React from 'react';
import { useParams } from 'react-router-dom';
import { itemPriceFormatter } from 'utils/formatters';
import { getOrderTotalPriceToDisplay } from 'utils/functions';
import { t } from 'utils/i18n';
import { OrderBaseDrawer } from '../OrderBaseDrawer';
import { Cancelation } from './Cancelation';
import { CookingTime } from './CookingTime';
import { DeliveryInfos } from './DeliveryInfos';

interface Props {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  orderId: string;
};

export const OrderDrawer = (props: Props) => {
  //context
  const isError = false;
  const error = '';
  const { orderId } = useParams<Params>();
  //const { getOrderById, cancelOrder } = useOrdersContext();
  const { order, updateOrder, cancelOrder, orderIssues } = useOrder(orderId);
  //const order = getOrderById(orderId);
  console.log('orderIssues', orderIssues);
  const isCurrierArrived = order?.dispatchingState === 'arrived-pickup';
  // state
  const [isCanceling, setIsCanceling] = React.useState(false);
  const [orderIssue, setOrderIssue] = React.useState<WithId<OrderIssue>>();
  const orderTotalPrice = getOrderTotalPriceToDisplay(order?.items || []);
  // handlers

  const handleCancel = async (issue: WithId<Issue>) => {
    await cancelOrder(issue);
    props.onClose();
  };

  // side effects
  React.useEffect(() => {
    if (orderIssues) {
      const issue = orderIssues.find((data) =>
        ['courier-cancel', 'consumer-cancel', 'restaurant-cancel'].includes(data.issue.type)
      );
      setOrderIssue(issue);
    }
  }, [orderIssues]);

  console.log(orderIssue);
  // UI
  return (
    <OrderBaseDrawer
      {...props}
      orderId={orderId}
      orderCode={order?.code ?? ''}
      orderStatus={order?.status!}
      orderIssue={orderIssue}
      isCurrierArrived={isCurrierArrived}
      client={order?.consumer?.name ?? ''}
      clientOrders={0}
      cancel={() => setIsCanceling(true)}
      isCanceling={isCanceling}
      isError={isError}
      error={error}
    >
      {isCanceling ? (
        <Cancelation handleConfirm={handleCancel} handleKeep={() => setIsCanceling(false)} />
      ) : (
        <>
          {(order?.status === 'ready' || order?.status === 'dispatching') && (
            <DeliveryInfos order={order} />
          )}
          <Text mt="6" fontSize="xl" color="black">
            {t('Detalhes do pedido')}
          </Text>
          <Table size="md" variant="simple">
            <Thead>
              <Tr>
                <Th>{t('Item')}</Th>
                <Th isNumeric>{t('Qtde.')}</Th>
                <Th isNumeric>{t('Valor/Item')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {order?.items?.map((item: OrderItem) => (
                <React.Fragment key={Math.random()}>
                  <Tr color="black" fontSize="xs" fontWeight="700">
                    <Td>{item.product.name}</Td>
                    <Td isNumeric>{item.quantity}</Td>
                    <Td isNumeric>{itemPriceFormatter(item.product.price * item.quantity)}</Td>
                  </Tr>
                  {item.complements &&
                    item.complements.map((complement) => (
                      <Tr key={Math.random()} fontSize="xs">
                        <Td>{complement.name}</Td>
                        <Td isNumeric>1</Td>
                        <Td isNumeric>{itemPriceFormatter(complement.price)}</Td>
                      </Tr>
                    ))}
                </React.Fragment>
              ))}
            </Tbody>
            <Tfoot bgColor="gray.50">
              <Tr color="black">
                <Th>{t('Valor total de itens:')}</Th>
                <Th></Th>
                <Th isNumeric>{orderTotalPrice}</Th>
              </Tr>
            </Tfoot>
          </Table>
          <Text mt="10" fontSize="xl" color="black">
            {t('Observações')}
          </Text>
          <Text mt="1" fontSize="md">
            {t('Incluir CPF na nota, CPF: 000.000.000-00')}
            <Pendency />
          </Text>
          {order?.status !== 'canceled' ? (
            <>
              <Text mt="10" fontSize="xl" color="black">
                {t('Forma de pagamento')}
              </Text>
              <Text mt="1" fontSize="md">
                {t('Total pago:')}{' '}
                <Text as="span" color="black">
                  {orderTotalPrice}
                </Text>
              </Text>
              <Text mt="1" fontSize="md">
                {t('Método de pagamento:')}{' '}
                <Text as="span" color="black">
                  <Pendency />
                </Text>
              </Text>
            </>
          ) : (
            <>
              <Text mt="10" fontSize="xl" color="black">
                {t('Motivo do cancelamento')}
              </Text>
              <Text mt="1" fontSize="md">
                {orderIssue?.issue.title ?? 'N/E'}
              </Text>
            </>
          )}
          {(order?.status === 'confirmed' || order?.status === 'preparing') && (
            <CookingTime orderId={order.id} cookingTime={order.cookingTime} />
          )}
        </>
      )}
    </OrderBaseDrawer>
  );
};
