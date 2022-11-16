import { LedgerEntry, WithId } from '@appjusto/types';
import TableItem from 'common/components/backoffice/TableItem';
import { useRouteMatch } from 'react-router';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';
import { ledgerEntryStatusPTOptions } from '../utils';

interface ItemProps {
  entry: WithId<LedgerEntry>;
}

export const EntriesTableItem = ({ entry }: ItemProps) => {
  // context
  const { path } = useRouteMatch();
  // UI
  return (
    <TableItem
      key={entry.id}
      link={`${path}/${entry.id}`}
      columns={[
        {
          value: entry.orderId ? entry.orderId : 'N/E',
          styles: { maxW: '120px' },
        },
        { value: getDateAndHour(entry.createdOn) },
        {
          value: entry.status
            ? ledgerEntryStatusPTOptions[entry.status]
            : 'N/E',
        },
        { value: formatCurrency(entry.value), styles: { isNumeric: true } },
      ]}
    />
  );
};
