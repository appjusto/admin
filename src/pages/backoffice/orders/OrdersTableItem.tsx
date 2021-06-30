import { Td, Tr } from '@chakra-ui/react';
import { OrderAlgolia } from 'appjusto-types/algolia';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { useRouteMatch } from 'react-router';
import { formatCurrency } from 'utils/formatters';
import { getAlgoliaFieldDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface ItemProps {
  order: OrderAlgolia;
}

export const OrdersTableItem = ({ order }: ItemProps) => {
  // context
  const { path } = useRouteMatch();
  const isBackoffice = path.includes('backoffice');
  // helpers
  const getFoodOrderTotal = () => {
    let total = 0;
    if (!isBackoffice) {
      if (order.businessValue) total = order.businessValue;
      else return 'N/E';
    } else {
      if (order.totalOrder) total = order.totalOrder;
      else return 'N/E';
    }
    return formatCurrency(total);
  };
  const total = getFoodOrderTotal();
  // UI
  return (
    <Tr key={order.objectID} color="black" fontSize="15px" lineHeight="21px">
      <Td maxW="120px">{order.code ?? 'N/I'}</Td>
      <Td>{order.createdOn ? getAlgoliaFieldDateAndHour(order.createdOn) : 'N/I'}</Td>
      <Td>{order.consumerName ?? 'N/I'}</Td>
      <Td>{order.courierName ?? 'N/I'}</Td>
      <Td>{total}</Td>
      <Td>
        <CustomButton
          mt="0"
          variant="outline"
          label={t('Detalhes')}
          link={`${path}/${order.objectID}`}
          size="sm"
        />
      </Td>
    </Tr>
  );
};
