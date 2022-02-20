import { Invoice, WithId } from '@appjusto/types';
import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { t } from 'utils/i18n';
import { InvoicesTableItem } from './InvoicesTableItem';

interface InvoicesTableProps {
  invoices?: WithId<Invoice>[] | null;
}

export const InvoicesTable = ({ invoices }: InvoicesTableProps) => {
  // UI
  return (
    <Box mt="6" maxW="100vw" overflowX="auto">
      <Table mt="4" size="md" variant="simple" pos="relative">
        <Thead>
          <Tr>
            <Th>{t('ID do pedido')}</Th>
            <Th>{t('Data')}</Th>
            <Th>{t('Tipo')}</Th>
            <Th>{t('Status')}</Th>
            <Th>{t('Valor')}</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {!invoices ? (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Carregando faturas...')}</Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          ) : invoices.length > 0 ? (
            invoices.map((invoice) => {
              return <InvoicesTableItem key={invoice.id} invoice={invoice} />;
            })
          ) : (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Não foram encontrados resultados')}</Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};
