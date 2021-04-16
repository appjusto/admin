import { Td, Tr } from '@chakra-ui/react';
import { Order, WithId } from 'appjusto-types';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { useRouteMatch } from 'react-router';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface ItemProps {
  order: WithId<Order>;
}

export const OrdersTableItem = ({ order }: ItemProps) => {
  // context
  const { path } = useRouteMatch();
  // helpers

  // UI
  return (
    <Tr key={order.id} color="black" fontSize="15px" lineHeight="21px">
      <Td maxW="120px">{order.id}</Td>
      <Td>
        {order.createdOn ? getDateAndHour(order.createdOn as firebase.firestore.Timestamp) : ''}
      </Td>
      <Td>{'Nome do cliente'}</Td>
      <Td>{'Nome do entregador'}</Td>
      <Td>{'valor'}</Td>
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
