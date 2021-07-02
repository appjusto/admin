import { Td, Tr } from '@chakra-ui/react';
import { Invoice, WithId } from 'appjusto-types';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';
import { invoiceStatusPTOptions, invoiceTypePTOptions } from '../utils';

interface ItemProps {
  invoice: WithId<Invoice>;
}

export const InvoicesTableItem = ({ invoice }: ItemProps) => {
  // UI
  return (
    <Tr color="black" fontSize="15px" lineHeight="21px">
      <Td>{invoice.id ?? 'N/I'}</Td>
      <Td>{getDateAndHour(invoice.createdOn)}</Td>
      <Td>{invoice.status ? invoiceStatusPTOptions[invoice.status] : 'N/E'}</Td>
      <Td>{invoice.invoiceType ? invoiceTypePTOptions[invoice.invoiceType] : 'N/E'}</Td>
      <Td>{invoice.orderId}</Td>
      <Td>{formatCurrency(invoice.value)}</Td>
    </Tr>
  );
};
