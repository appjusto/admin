import { LedgerEntry, WithId } from '@appjusto/types';
import { Link, Td, Tr } from '@chakra-ui/react';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { useRouteMatch } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { ledgerEntryStatusPTOptions } from '../utils';

interface ItemProps {
  entry: WithId<LedgerEntry>;
}

export const EntriesTableItem = ({ entry }: ItemProps) => {
  // context
  const { path } = useRouteMatch();
  // UI
  return (
    <Tr color="black" fontSize="15px" lineHeight="21px">
      <Td>
        {entry.orderId ? (
          <Link as={RouterLink} to={`/backoffice/orders/${entry.orderId}`}>
            {entry.orderId}
          </Link>
        ) : (
          'N/E'
        )}
      </Td>
      <Td>{getDateAndHour(entry.createdOn)}</Td>
      <Td>{entry.status ? ledgerEntryStatusPTOptions[entry.status] : 'N/E'}</Td>
      <Td>{formatCurrency(entry.value)}</Td>
      <Td>
        <CustomButton
          mt="0"
          variant="outline"
          label={t('Detalhes')}
          link={`${path}/${entry.id}`}
          size="sm"
        />
      </Td>
    </Tr>
  );
};
