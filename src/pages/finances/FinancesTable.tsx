import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { useRouteMatch } from 'react-router-dom';
import { formatCurrency } from 'utils/formatters';
import { t } from 'utils/i18n';
import { Period } from './FinancesPage';

interface FinancesTableProps {
  periods?: Period[];
}

export const FinancesTable = ({ periods }: FinancesTableProps) => {
  // context
  const { url } = useRouteMatch();
  // UI
  return (
    <Box mt="12">
      <Table mt="4" size="md" variant="simple">
        <Thead>
          <Tr>
            <Th>{t('Período')}</Th>
            <Th isNumeric>{t('Recebido')}</Th>
            <Th isNumeric>{t('Taxas')}</Th>
            <Th isNumeric>{t('Repasse')}</Th>
            <Th>{t('Status')}</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {periods && periods.length > 0 ? (
            periods.map((period) => {
              return (
                <Tr key={period.id} color="black" fontSize="xs">
                  <Td>{period.period}</Td>
                  <Td isNumeric>{formatCurrency(period.received)}</Td>
                  <Td isNumeric>{'-' + formatCurrency(period.fees)}</Td>
                  <Td isNumeric>{formatCurrency(period.transfers)}</Td>
                  <Td>{period.status}</Td>
                  <Td>
                    <CustomButton
                      mt="0"
                      label={t('Detalhes')}
                      link={`${url}/${period.id}`}
                      size="sm"
                    />
                  </Td>
                </Tr>
              );
            })
          ) : (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Sem resultados para o número informado')}</Td>
              <Td isNumeric></Td>
              <Td isNumeric></Td>
              <Td isNumeric></Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};
