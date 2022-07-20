import { Icon, Table, Tbody, Td, Text, Tfoot, Th, Tooltip, Tr } from '@chakra-ui/react';
import { usePlatformFees } from 'app/api/platform/usePlatformFees';
import { MdInfoOutline } from 'react-icons/md';
import { formatCurrency, formatPct } from 'utils/formatters';
import { t } from 'utils/i18n';
import { InvoicesCosts } from './utils';

interface PeriodTableProps {
  period: string;
  amount: number;
  appjustoCosts: InvoicesCosts;
  iuguCosts: InvoicesCosts;
}

export const PeriodTable = ({ period, amount, appjustoCosts, iuguCosts }: PeriodTableProps) => {
  // context
  const { platformFees } = usePlatformFees();
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
              <Td color="black">{t(`Taxas - AppJusto (${formatPct(appjustoCosts.fee)})`)}</Td>
              <Td color="red" isNumeric>
                {`- ${formatCurrency(appjustoCosts.value)}`}
              </Td>
            </Tr>
            <Tr fontSize="xs" fontWeight="500">
              <Td color="black">
                {t(`Taxas - Iugu (${formatPct(iuguCosts.fee)})`)}
                <Tooltip 
                  placement="top" 
                  label={platformFees?.iuguFeeDescription ?? 'Informação não encontrada'}
                >
                  <Text as="span">
                    <Icon 
                      ml="2" 
                      w="16px" 
                      h="16px" 
                      cursor="pointer" 
                      as={MdInfoOutline} 
                    />
                  </Text>
                </Tooltip>
              </Td>
              <Td color="red" isNumeric>
                {`- ${formatCurrency(iuguCosts.value)}`}
              </Td>
            </Tr>
          </>
        )}
      </Tbody>
      <Tfoot bgColor="gray.50">
        <Tr>
          <Th>{t(`Resultado para ${period}`)}</Th>
          <Th color="green.700" isNumeric>
            {formatCurrency(amount - appjustoCosts.value - iuguCosts.value)}
          </Th>
        </Tr>
      </Tfoot>
    </Table>
  );
};
