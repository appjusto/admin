import { Link, Td, Tr } from '@chakra-ui/react';
import { Invoice, WithId } from 'appjusto-types';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { useRouteMatch } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { invoiceStatusPTOptions, invoiceTypePTOptions } from '../utils';

interface ItemProps {
  invoice: WithId<Invoice>;
}

export const InvoicesTableItem = ({ invoice }: ItemProps) => {
  // context
  const { path } = useRouteMatch();
  // UI
  return (
    <Tr color="black" fontSize="15px" lineHeight="21px">
      <Td>
        <Link as={RouterLink} to={`${path}/order/${invoice.orderId}`}>
          {invoice.orderId ?? 'N/I'}
        </Link>
      </Td>
      <Td>{getDateAndHour(invoice.createdOn)}</Td>
      <Td>{invoice.invoiceType ? invoiceTypePTOptions[invoice.invoiceType] : 'N/E'}</Td>
      <Td>{invoice.status ? invoiceStatusPTOptions[invoice.status] : 'N/E'}</Td>
      <Td>{formatCurrency(invoice.value)}</Td>
      <Td>
        <CustomButton
          mt="0"
          variant="outline"
          label={t('Detalhes')}
          link={`${path}/${invoice.id}`}
          size="sm"
        />
      </Td>
    </Tr>
  );
};
