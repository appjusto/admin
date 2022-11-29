import { StaffProfile, WithId } from '@appjusto/types';
import TableItem from 'common/components/backoffice/TableItem';
import { phoneFormatter } from 'common/components/form/input/pattern-input/formatters';
import { useRouteMatch } from 'react-router-dom';
import { getDateAndHour } from 'utils/functions';
import { situationPTOptions } from '../utils';

interface StaffsTableItemProps {
  staff: WithId<StaffProfile>;
}

export const StaffsTableItem = ({ staff }: StaffsTableItemProps) => {
  // context
  const { path } = useRouteMatch();
  // state
  // UI
  return (
    <TableItem
      key={staff.id}
      link={`${path}/${staff.id}`}
      columns={[
        { value: staff.email },
        { value: getDateAndHour(staff.createdOn) },
        {
          value: staff.situation ? situationPTOptions[staff.situation] : 'N/I',
        },
        { value: staff.name ?? 'N/I' },
        { value: staff.phone ? phoneFormatter(staff.phone) : 'N/I' },
      ]}
    />
  );
};
