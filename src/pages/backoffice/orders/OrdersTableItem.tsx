import { Order, OrderStatus, WithId } from '@appjusto/types';
import { Td, Tr } from '@chakra-ui/react';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { useRouteMatch } from 'react-router';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { orderStatusPTOptionsForTableItem } from '../utils';
import { getFoodOrderTotal } from './utils';

interface ItemProps {
  order: WithId<Order>;
  isBackoffice?: boolean;
}

export const OrdersTableItem = ({ order, isBackoffice }: ItemProps) => {
  // context
  const { path } = useRouteMatch();
  // helpers
  const total = getFoodOrderTotal(order, isBackoffice);
  // UI
  return (
    <Tr key={order.id} color="black" fontSize="15px" lineHeight="21px">
      <Td maxW="120px">{order.code ?? 'N/I'}</Td>
      <Td>{getDateAndHour(order.updatedOn)}</Td>
      <Td>
        {order.scheduledTo ? getDateAndHour(order.scheduledTo) : 'Tempo real'}
      </Td>
      {isBackoffice && (
        <Td>
          {order.type ? (order.type === 'food' ? 'Comida' : 'Entrega') : 'N/E'}
        </Td>
      )}
      <Td>
        {order.status
          ? orderStatusPTOptionsForTableItem[order.status as OrderStatus]
          : 'N/I'}
      </Td>
      {isBackoffice && <Td>{order.business?.name ?? 'N/I'}</Td>}
      <Td>{order.consumer.name ?? 'N/I'}</Td>
      <Td>
        {order.dispatchingStatus === 'outsourced'
          ? 'Fora da rede'
          : order.courier?.name ?? 'N/E'}
      </Td>
      <Td>{formatCurrency(total)}</Td>
      <Td>
        <CustomButton
          mt="0"
          variant="outline"
          label={t('Detalhes')}
          link={`${path}/${order.id}`}
          size="sm"
        />
      </Td>
    </Tr>
  );
};
