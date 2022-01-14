import { Table, Tbody, Td, Tfoot, Th, Tr } from '@chakra-ui/react';
import { AccountWithdraw, WithId } from 'appjusto-types';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { formatCents, formatIuguValueToDisplay } from './utils';

const withdrawStatusPTOptions = {
  pending: 'Pendente',
  processing: 'Processando',
  accepted: 'Aceito',
  rejected: 'Rejeitado',
};

interface WithdrawsTableItemProps {
  withdraw: WithId<AccountWithdraw>;
}

const WithdrawsTableItem = ({ withdraw }: WithdrawsTableItemProps) => {
  // UI
  return (
    <Tr color="black" fontSize="15px" lineHeight="21px" fontWeight="500">
      <Td>{getDateAndHour(withdraw.createdOn)}</Td>
      <Td isNumeric>{formatIuguValueToDisplay(withdraw.amount)}</Td>
      <Td>{withdrawStatusPTOptions[withdraw.status]}</Td>
    </Tr>
  );
};

interface WithdrawsTableProps {
  withdraws?: WithId<AccountWithdraw>[];
}

export const WithdrawsTable = ({ withdraws }: WithdrawsTableProps) => {
  // helpers
  const total =
    withdraws?.reduce<number>((result, item) => {
      const value = formatCents(item.amount);
      return (result += value);
    }, 0) ?? 0;
  // UI
  return (
    <Table mt="4" size="md" variant="simple">
      <Tbody>
        <Tr fontSize="15px" lineHeight="21px" fontWeight="500">
          <Td w="160px">{t('Data')}</Td>
          <Td w="200px" isNumeric>
            {t('Valor da transferência')}
          </Td>
          <Td>{t('Status')}</Td>
        </Tr>
        {withdraws !== undefined ? (
          withdraws.length > 0 ? (
            withdraws.map((withdraw) => (
              <WithdrawsTableItem key={withdraw.id} withdraw={withdraw} />
            ))
          ) : (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td w="300px">{t('Sem resultados para o período informado')}</Td>
              <Td isNumeric></Td>
              <Td></Td>
            </Tr>
          )
        ) : (
          <Tr color="black" fontSize="xs" fontWeight="700">
            <Td>{t('Carregando...')}</Td>
            <Td></Td>
            <Td></Td>
          </Tr>
        )}
      </Tbody>
      <Tfoot bgColor="gray.50">
        <Tr>
          <Th>{t('Total')}</Th>
          <Th color="green.700" isNumeric>
            {formatCurrency(total)}
          </Th>
          <Th></Th>
        </Tr>
      </Tfoot>
    </Table>
  );
};
