import { Invoice, WithId } from '@appjusto/types';
import TableItem from 'common/components/backoffice/TableItem';
import { useRouteMatch } from 'react-router';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';
import { invoiceStatusPTOptions, invoiceTypePTOptions } from '../utils';

interface ItemProps {
  invoice: WithId<Invoice>;
}

export const InvoicesTableItem = ({ invoice }: ItemProps) => {
  // context
  const { path } = useRouteMatch();
  // helpers
  const value = invoice.paid !== undefined ? invoice.paid : invoice.value;
  // UI
  return (
    <TableItem
      key={invoice.id}
      link={`${path}/${invoice.id}`}
      columns={[
        { value: invoice.orderCode ?? 'N/E', styles: { maxW: '120px' } },
        { value: getDateAndHour(invoice.createdOn) },
        {
          value: invoice.invoiceType
            ? invoiceTypePTOptions[invoice.invoiceType]
            : 'N/E',
        },
        {
          value: invoice.status
            ? invoiceStatusPTOptions[invoice.status]
            : 'N/E',
        },
        { value: formatCurrency(value), styles: { isNumeric: true } },
      ]}
    />
  );
};
