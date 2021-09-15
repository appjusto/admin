import { Table, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import { AccountWithdraw, WithId } from 'appjusto-types';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

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
      <Td isNumeric>{withdraw.amount}</Td>
      <Td>{withdrawStatusPTOptions[withdraw.status]}</Td>
    </Tr>
  );
};

interface WithdrawsTableProps {
  withdraws?: WithId<AccountWithdraw>[] | null;
}

export const WithdrawsTable = ({ withdraws }: WithdrawsTableProps) => {
  // helpers
  const formatCents = (value: string) => {
    let result = 0;
    if (value.includes('R$')) {
      result = parseFloat(value.split(' ')[1].replace(',', '.')) * 100;
    } else {
      result = parseFloat(value.split(' ')[0].replace(',', '.')) * 100;
    }
    return result;
  };
  const total =
    withdraws?.reduce<number>((result, item) => {
      const value = formatCents(item.amount);
      return (result += value);
    }, 0) ?? 0;
  // UI
  return (
    <Table mt="4" size="md" variant="simple">
      <Thead>
        <Tr>
          <Th>{t('Data')}</Th>
          <Th isNumeric>{t('Valor da transferência')}</Th>
          <Th>{t('Status')}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {withdraws !== undefined ? (
          withdraws !== null ? (
            withdraws.map((withdraw) => (
              <WithdrawsTableItem key={withdraw.id} withdraw={withdraw} />
            ))
          ) : (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Sem resultados para o mês informado')}</Td>
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
