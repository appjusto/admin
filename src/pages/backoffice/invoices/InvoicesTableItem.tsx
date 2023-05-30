import { Invoice, Payment, WithId } from '@appjusto/types';
import TableItem from 'common/components/backoffice/TableItem';
import { useRouteMatch } from 'react-router';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';
import { invoiceStatusPTOptions, invoiceTypePTOptions } from '../utils';

interface ItemProps {
  data: WithId<Invoice | Payment>;
}

export const InvoicesTableItem = ({ data }: ItemProps) => {
  // context
  const { path } = useRouteMatch();
  // helpers
  const value = data.paid !== undefined ? data.paid : data.value;
  const isPayment = 'createdAt' in data;
  if (isPayment) {
    const { id, order, createdAt, status, service } = data as WithId<Payment>;
    return (
      <TableItem
        key={id}
        link={`${path}/payments/${id}`}
        columns={[
          { value: order?.code ?? 'N/E', styles: { maxW: '120px' } },
          { value: getDateAndHour(createdAt) },
          {
            value: service ? invoiceTypePTOptions[service] : 'N/E',
          },
          {
            value: status ? invoiceStatusPTOptions[status] : 'N/E',
          },
          { value: formatCurrency(value), styles: { isNumeric: true } },
        ]}
      />
    );
  }
  const { id, orderCode, createdOn, invoiceType, status } =
    data as WithId<Invoice>;
  // UI
  return (
    <TableItem
      key={id}
      link={`${path}/${id}`}
      columns={[
        { value: orderCode ?? 'N/E', styles: { maxW: '120px' } },
        { value: getDateAndHour(createdOn) },
        {
          value: invoiceType ? invoiceTypePTOptions[invoiceType] : 'N/E',
        },
        {
          value: status ? invoiceStatusPTOptions[status] : 'N/E',
        },
        { value: formatCurrency(value), styles: { isNumeric: true } },
      ]}
    />
  );
};
