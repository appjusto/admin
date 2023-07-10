import { Complaint, WithId } from '@appjusto/types';
import TableItem from 'common/components/backoffice/TableItem';
import { useRouteMatch } from 'react-router';
import { getDateAndHour } from 'utils/functions';
import { complaintStatusPTOptions, flavorsPTOptions } from '../utils';

interface ItemProps {
  data: WithId<Complaint>;
}

export const ComplaintsTableItem = ({ data }: ItemProps) => {
  // context
  const { path } = useRouteMatch();
  // helpers
  const { id, orderId, createdAt, flavor, status } = data as WithId<Complaint>;
  // UI
  return (
    <TableItem
      key={id}
      link={`${path}/${id}`}
      columns={[
        { value: orderId ?? 'N/E', styles: { maxW: '120px' } },
        { value: getDateAndHour(createdAt) },
        {
          value: flavor ? flavorsPTOptions[flavor] : 'N/E',
        },
        {
          value: 'N/E',
        },
        {
          value: status ? complaintStatusPTOptions[status] : 'N/E',
        },
      ]}
    />
  );
};
