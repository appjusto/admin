import { Table, Tbody, Td, Tfoot, Th, Tr } from '@chakra-ui/react';
import { formatCurrency } from 'utils/formatters';
import { t } from 'utils/i18n';

interface PeriodTableProps {
  period: string;
  amount: number;
  appjustoFee: number;
  iuguFee: number;
}

export const PeriodTable = ({ period, amount, appjustoFee, iuguFee }: PeriodTableProps) => {
  // UI
  return (
    <Table mt="6" size="md" variant="simple">
      <Tbody>
        {amount === undefined ? (
          <Tr color="black" fontSize="xs" fontWeight="700">
            <Td>{t('Carregando...')}</Td>
            <Td></Td>
          </Tr>
        ) : (
          <>
            <Tr color="black" fontSize="xs" fontWeight="500">
              <Td>{t('Total de vendas')}</Td>
              <Td isNumeric>{formatCurrency(amount)}</Td>
            </Tr>
            <Tr fontSize="xs" fontWeight="500">
              <Td color="black">{t('Taxas - AppJusto (5%)')}</Td>
              <Td color="red" isNumeric>
                {`- ${formatCurrency(appjustoFee)}`}
              </Td>
            </Tr>
            <Tr fontSize="xs" fontWeight="500">
              <Td color="black">{t('Taxas - Iugu (2,21% + R$0,09)')}</Td>
              <Td color="red" isNumeric>
                {`- ${formatCurrency(iuguFee)}`}
              </Td>
            </Tr>
          </>
        )}
      </Tbody>
      <Tfoot bgColor="gray.50">
        <Tr>
          <Th>{t(`Resultado para ${period}`)}</Th>
          <Th color="green.700" isNumeric>
            {formatCurrency(amount - appjustoFee - iuguFee)}
          </Th>
        </Tr>
      </Tfoot>
    </Table>
  );
};
