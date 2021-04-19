import { Td, Tr } from '@chakra-ui/react';
import { OrderAlgolia } from 'appjusto-types/algolia';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { useRouteMatch } from 'react-router';
import { getAlgoliaFieldDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface ItemProps {
  order: OrderAlgolia;
}

export const OrdersTableItem = ({ order }: ItemProps) => {
  // context
  const { path } = useRouteMatch();
  // helpers

  // UI
  return (
    <Tr key={order.objectID} color="black" fontSize="15px" lineHeight="21px">
      <Td maxW="120px">{order.code ?? 'N/I'}</Td>
      <Td>
        {order.createdOn
          ? getAlgoliaFieldDateAndHour(order.createdOn as firebase.firestore.Timestamp)
          : 'N/I'}
      </Td>
      <Td>{order.consumerName ?? 'N/I'}</Td>
      <Td>{order.courierName ?? 'N/I'}</Td>
      <Td>{'valor'}</Td>
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
