import { Table, Tbody, Td, Text, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import { OrderItem } from 'appjusto-types';
import React from 'react';
import { useParams } from 'react-router-dom';
import { itemPriceFormatter } from 'utils/formatters';
import { t } from 'utils/i18n';
import { useOrdersContext } from '../../context';
import { OrderBaseDrawer } from '../OrderBaseDrawer';
import { Cancelation } from './Cancelation';
import { DeliveryInfos } from './DeliveryInfos';
import { PreparationTime } from './PreparationTime';

export const Pendency = () => {
  return (
    <Text as="span" color="red" ml="2" fontSize="lg">
      *
    </Text>
  );
};

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
  const { getOrderById } = useOrdersContext();
  const order = getOrderById(orderId);
  // state
  const [preparationTime, setPreparationTime] = React.useState<string | undefined>(undefined);
  const [isCanceling, setIsCanceling] = React.useState(false);

  // handlers
  const tableTotal = order.items.reduce(
    (n1: number, n2: OrderItem) => n1 + n2.product.price * n2.quantity,
    0
  );
  // side effects

  // UI
  return (
    <OrderBaseDrawer
      {...props}
      orderId={order.id}
      orderCode={order.code}
      orderStatus={order.status}
      client={order.consumer.name}
      clientOrders={6}
      cancel={() => setIsCanceling(true)}
      isCanceling={isCanceling}
      isError={isError}
      error={error}
    >
      {isCanceling ? (
        <Cancelation handleConfirm={() => {}} handleKeep={() => setIsCanceling(false)} />
      ) : (
        <>
          {(order.status === 'ready' || order.status === 'dispatching') && <DeliveryInfos />}
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
              {order.items.map((item: OrderItem) => (
                <Tr key={item.product.id} color="black" fontSize="xs">
                  <Td>{item.product.name}</Td>
                  <Td isNumeric>{item.quantity}</Td>
                  <Td isNumeric>{itemPriceFormatter(item.quantity * item.product.price)}</Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot bgColor="gray.50">
              <Tr color="black">
                <Th>{t('Valor total de itens:')}</Th>
                <Th></Th>
                <Th isNumeric>{itemPriceFormatter(tableTotal)}</Th>
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
          <Text mt="10" fontSize="xl" color="black">
            {t('Forma de pagamento')}
          </Text>
          <Text mt="1" fontSize="md">
            {t('Total pago:')}{' '}
            <Text as="span" color="black">
              {itemPriceFormatter(tableTotal)}
            </Text>
          </Text>
          <Text mt="1" fontSize="md">
            {t('Método de pagamento:')}{' '}
            <Text as="span" color="black">
              {order.payment.paymentMethodId}
            </Text>
          </Text>
          {order.status === 'confirming' && (
            <PreparationTime
              preparationTime={preparationTime}
              notifyParentWithTime={(time) => setPreparationTime(time)}
            />
          )}
        </>
      )}
    </OrderBaseDrawer>
  );
};
