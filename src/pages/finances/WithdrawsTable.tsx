import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { AccountWithdraw, WithId } from 'appjusto-types';
import { useRouteMatch } from 'react-router-dom';
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
  // context
  const { url } = useRouteMatch();
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
              <Td>{t('Sem resultados para o número informado')}</Td>
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
    </Table>
  );
};
