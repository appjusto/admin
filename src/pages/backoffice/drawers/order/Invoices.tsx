import { Invoice, OrderPaymentLog, Payment, WithId } from '@appjusto/types';
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
  payments?: WithId<Payment>[] | null;
  logs?: WithId<OrderPaymentLog>[];
  activeInvoices(): void;
}

export const Invoices = ({
  invoices,
  payments,
  logs,
  activeInvoices,
}: InvoicesProps) => {
  // helpers
  const isEmpty =
    (!invoices || invoices.length === 0) &&
    (!payments || payments.length === 0);
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
            {payments &&
              payments?.map((payment: WithId<Payment>) => {
                const paymentValue =
                  payment.paid !== undefined ? payment.paid : payment.value;
                return (
                  <Tr key={payment.id} color="black" fontSize="sm">
                    <Td>{getDateAndHour(payment.createdAt)}</Td>
                    <Td>
                      {payment.status
                        ? invoiceStatusPTOptions[payment.status]
                        : 'N/E'}
                    </Td>
                    <Td>'N/A'</Td>
                    <Td isNumeric>{formatCurrency(paymentValue)}</Td>
                    <Td>
                      <CustomButton
                        mt="0"
                        variant="outline"
                        label={t('Detalhes')}
                        link={`/backoffice/invoices/${payment.id}`}
                        size="sm"
                      />
                    </Td>
                  </Tr>
                );
              })}
            {invoices &&
              invoices?.map((invoice: WithId<Invoice>) => {
                const invoiceValue =
                  invoice.paid !== undefined ? invoice.paid : invoice.value;
                return (
                  <Tr key={invoice.id} color="black" fontSize="sm">
                    <Td>{getDateAndHour(invoice.createdOn)}</Td>
                    <Td>
                      {invoice.status
                        ? invoiceStatusPTOptions[invoice.status]
                        : 'N/E'}
                    </Td>
                    <Td>{invoiceTypePTOptions[invoice.invoiceType]}</Td>
                    <Td isNumeric>{formatCurrency(invoiceValue)}</Td>
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
                );
              })}
            {isEmpty && (
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
