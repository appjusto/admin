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
  const { id, code, createdAt, createdBy, status } = data as WithId<Complaint>;
  const { flavor, name } = createdBy;
  // UI
  return (
    <TableItem
      key={id}
      link={`${path}/${id}`}
      columns={[
        { value: code ?? 'N/E', styles: { maxW: '120px' } },
        { value: getDateAndHour(createdAt, true) },
        {
          value: flavor ? flavorsPTOptions[flavor] : 'N/E',
        },
        {
          value: name ?? 'N/E',
        },
        {
          value: status ? complaintStatusPTOptions[status] : 'N/E',
        },
      ]}
    />
  );
};
