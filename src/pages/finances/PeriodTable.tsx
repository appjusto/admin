import { Table, Tbody, Td, Tfoot, Th, Tr } from '@chakra-ui/react';
import { formatCurrency } from 'utils/formatters';
import { t } from 'utils/i18n';

interface PeriodTableProps {
  period: string;
  amount?: number;
}

export const PeriodTable = ({ period, amount }: PeriodTableProps) => {
  // helpers
  const appjustoFee = amount ? amount * 0.05 : 0;
  const iuguFee = amount ? amount * 0.025 : 0;
  const total = amount ? amount - (appjustoFee + iuguFee) : 0;
  // UI
  return (
    <Table mt="6" size="md" variant="simple">
      <Tbody>
        {amount ? (
          <>
            <Tr color="black" fontSize="xs" fontWeight="500">
              <Td>{t('Faturado no período')}</Td>
              <Td isNumeric>{formatCurrency(amount)}</Td>
            </Tr>
            <Tr fontSize="xs" fontWeight="500" color="red">
              <Td>{t('Taxas - AppJusto (5%)')}</Td>
              <Td isNumeric>- {formatCurrency(appjustoFee)}</Td>
            </Tr>
            <Tr fontSize="xs" fontWeight="500" color="red">
              <Td>{t('Taxas - Iugu (X%)')}</Td>
              <Td isNumeric>- {formatCurrency(iuguFee)}</Td>
            </Tr>
          </>
        ) : (
          <Tr color="black" fontSize="xs" fontWeight="700">
            <Td>{t('Carregando...')}</Td>
            <Td></Td>
          </Tr>
        )}
      </Tbody>
      <Tfoot bgColor="gray.50">
        <Tr>
          <Th>{t(`Resultado para ${period}`)}</Th>
          <Th color="green.700" isNumeric>
            {formatCurrency(total)}
          </Th>
        </Tr>
      </Tfoot>
    </Table>
  );
};
