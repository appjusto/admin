import { ConsumerAlgolia } from '@appjusto/types';
import TableItem from 'common/components/backoffice/TableItem';
import { useRouteMatch } from 'react-router';
import { getAlgoliaFieldDateAndHour } from 'utils/functions';

interface ItemProps {
  consumer: ConsumerAlgolia;
}

export const ConsumersTableItem = ({ consumer }: ItemProps) => {
  // context
  const { path } = useRouteMatch();
  //  UI
  const name = consumer.name
    ? `${consumer.name} ${consumer.surname ?? ''}`
    : 'N/I';
  return (
    <TableItem
      key={consumer.objectID}
      link={`${path}/${consumer.objectID}`}
      columns={[
        { value: consumer.code ?? 'N/I', styles: { maxW: '120px' } },
        {
          value: consumer.createdOn
            ? getAlgoliaFieldDateAndHour(consumer.createdOn)
            : 'N/E',
        },
        { value: name },
        { value: consumer.totalOrders ?? 0, styles: { isNumeric: true } },
      ]}
    />
  );
};
