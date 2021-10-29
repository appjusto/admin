import { Td, Tr } from '@chakra-ui/react';
import { Order, OrderStatus, WithId } from 'appjusto-types';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { useRouteMatch } from 'react-router';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { orderStatusPTOptionsForTableItem } from '../utils';

interface ItemProps {
  order: WithId<Order>;
  isBackoffice?: boolean;
}

export const OrdersTableItem = ({ order, isBackoffice }: ItemProps) => {
  // context
  const { path } = useRouteMatch();
  // helpers
  const getFoodOrderTotal = () => {
    let total = 0;
    if (!isBackoffice) {
      if (order.dispatchingStatus === 'outsourced' && order.fare?.total) total = order.fare.total;
      else if (order.fare?.business?.value) total = order.fare.business.value;
      else return 'N/E';
    } else {
      if (order.fare?.total) total = order.fare.total;
      else return 'N/E';
    }
    return formatCurrency(total);
  };
  const total = getFoodOrderTotal();
  // UI
  return (
    <Tr key={order.id} color="black" fontSize="15px" lineHeight="21px">
      <Td maxW="120px">{order.code ?? 'N/I'}</Td>
      <Td>{getDateAndHour(order.updatedOn!)}</Td>
      {isBackoffice && (
        <Td>{order.type ? (order.type === 'food' ? 'Comida' : 'Entrega') : 'N/E'}</Td>
      )}
      <Td>
        {order.status ? orderStatusPTOptionsForTableItem[order.status as OrderStatus] : 'N/I'}
      </Td>
      {isBackoffice && <Td>{order.business?.name ?? 'N/I'}</Td>}
      <Td>{order.consumer.name ?? 'N/I'}</Td>
      <Td>
        {order.dispatchingStatus === 'outsourced' ? 'Fora da rede' : order.courier?.name ?? 'N/E'}
      </Td>
      <Td>{total}</Td>
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
