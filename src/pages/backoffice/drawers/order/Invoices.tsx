import { Invoice, OrderPaymentLog, WithId } from '@appjusto/types';
import { Box, Table, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import { CustomButton } from 'common/components/buttons/CustomButton';
import {
  invoiceStatusPTOptions,
  invoiceTypePTOptions,
} from 'pages/backoffice/utils';
import React from 'react';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../../../backoffice/drawers/generics/SectionTitle';
import { LogsTable } from './invoices/LogsTable';

interface InvoicesProps {
  invoices?: WithId<Invoice>[] | null;
  logs?: WithId<OrderPaymentLog>[];
  activeInvoices(): void;
}

export const Invoices = ({ invoices, logs, activeInvoices }: InvoicesProps) => {
  // side effects
  React.useEffect(() => {
    if (invoices && invoices?.length > 0) return;
    activeInvoices();
  }, [activeInvoices, invoices]);
  // UI
  return (
    <Box>
      <SectionTitle mt="10">{t('Faturas do pedido')}</SectionTitle>
      <Box overflowX="auto">
        <Table mt="4" size="md" variant="simple">
          <Thead>
            <Tr>
              <Th>{t('Data/Horário')}</Th>
              <Th>{t('Status')}</Th>
              <Th>{t('Tipo')}</Th>
              <Th isNumeric>{t('Valor')}</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {invoices && invoices.length > 0 ? (
              invoices?.map((invoice: WithId<Invoice>) => (
                <Tr key={invoice.id} color="black" fontSize="sm">
                  <Td>{getDateAndHour(invoice.createdOn)}</Td>
                  <Td>
                    {invoice.status
                      ? invoiceStatusPTOptions[invoice.status]
                      : 'N/E'}
                  </Td>
                  <Td>{invoiceTypePTOptions[invoice.invoiceType]}</Td>
                  <Td isNumeric>{formatCurrency(invoice.value)}</Td>
                  <Td>
                    <CustomButton
                      mt="0"
                      variant="outline"
                      label={t('Detalhes')}
                      link={`/backoffice/invoices/${invoice.id}`}
                      size="sm"
                    />
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr color="black" fontSize="sm" fontWeight="700">
                <Td>{t('Não foram encontradas faturas para este pedido.')}</Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
              </Tr>
            )}
          </Tbody>
          <Tfoot bgColor="gray.50"></Tfoot>
        </Table>
      </Box>
      <SectionTitle>{t('Logs do pagamento')}</SectionTitle>
      <Box
        mt="4"
        maxH="300px"
        overflowY="scroll"
        border="1px solid #ECF0E3"
        borderRadius="lg"
      >
        <LogsTable logs={logs} />
      </Box>
    </Box>
  );
};
