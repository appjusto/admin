import { Table, Tbody, Td, Tfoot, Th, Tr } from '@chakra-ui/react';
import { formatCurrency } from 'utils/formatters';
import { t } from 'utils/i18n';

interface PeriodTableProps {
  period: string;
  amount?: number | null;
  appjustoFee?: number | null;
  iuguFee?: number | null;
}

export const PeriodTable = ({ period, amount, appjustoFee, iuguFee }: PeriodTableProps) => {
  // helpers
  const getResult = () => {
    if (!amount || !appjustoFee || !iuguFee) return 0;
    return amount - appjustoFee - iuguFee;
  };
  // UI
  return (
    <Table mt="6" size="md" variant="simple">
      <Tbody>
        {amount ? (
          <>
            <Tr color="black" fontSize="xs" fontWeight="500">
              <Td>{t('Total de vendas')}</Td>
              <Td isNumeric>{formatCurrency(amount)}</Td>
            </Tr>
            <Tr fontSize="xs" fontWeight="500">
              <Td color="black">{t('Taxas - AppJusto (5%)')}</Td>
              <Td color="red" isNumeric>
                {appjustoFee ? `- ${formatCurrency(appjustoFee)}` : 'N/E'}
              </Td>
            </Tr>
            <Tr fontSize="xs" fontWeight="500">
              <Td color="black">{t('Taxas - Iugu (2,21% + R$0,09)')}</Td>
              <Td color="red" isNumeric>
                {iuguFee ? `- ${formatCurrency(iuguFee)}` : 'N/E'}
              </Td>
            </Tr>
          </>
        ) : amount === null ? (
          <Tr color="black" fontSize="xs" fontWeight="700">
            <Td>{t('Não há dados para o período informado')}</Td>
            <Td></Td>
          </Tr>
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
            {formatCurrency(getResult())}
          </Th>
        </Tr>
      </Tfoot>
    </Table>
  );
};
