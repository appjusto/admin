import { Invoice, Payment, WithId } from '@appjusto/types';
import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { t } from 'utils/i18n';
import { InvoicesTableItem } from './InvoicesTableItem';

interface InvoicesTableProps {
  invoices?: WithId<Invoice>[] | null;
  payments?: WithId<Payment>[] | null;
}

export const InvoicesTable = ({ invoices, payments }: InvoicesTableProps) => {
  // helpers
  const isLoading = invoices === undefined && payments === undefined;
  const isEmpty =
    (!invoices || invoices.length === 0) &&
    (!payments || payments.length === 0);
  // UI
  return (
    <Box mt="6" maxW="100vw" overflowX="auto">
      <Table mt="4" size="md" variant="simple" pos="relative">
        <Thead>
          <Tr>
            <Th>{t('ID do pedido')}</Th>
            <Th>{t('Data')}</Th>
            <Th>{t('Tipo')}</Th>
            <Th>{t('Método de Pag.')}</Th>
            <Th>{t('Status')}</Th>
            <Th isNumeric>{t('Valor')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {isLoading && (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Carregando faturas...')}</Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td isNumeric></Td>
            </Tr>
          )}
          {isEmpty && (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Não foram encontrados resultados')}</Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td isNumeric></Td>
            </Tr>
          )}
          {payments &&
            payments.map((payment) => {
              return <InvoicesTableItem key={payment.id} data={payment} />;
            })}
          {invoices &&
            invoices.map((invoice) => {
              return <InvoicesTableItem key={invoice.id} data={invoice} />;
            })}
        </Tbody>
      </Table>
    </Box>
  );
};
