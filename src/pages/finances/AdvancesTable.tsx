import { Table, Tbody, Td, Tfoot, Th, Tr } from '@chakra-ui/react';
import { AccountAdvance, WithId } from 'appjusto-types';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { useRouteMatch } from 'react-router-dom';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface AdvancesTableItemProps {
  advance: WithId<AccountAdvance>;
}

const AdvancesTableItem = ({ advance }: AdvancesTableItemProps) => {
  // context
  const { url } = useRouteMatch();
  // UI
  return (
    <Tr color="black" fontSize="15px" lineHeight="21px" fontWeight="500">
      <Td>{getDateAndHour(advance.createdOn)}</Td>
      <Td isNumeric>{advance.data.total.advanced_value}</Td>
      <Td color="red" isNumeric>
        {'-' + advance.data.total.advance_fee}
      </Td>
      <Td color="green.700" isNumeric>
        {advance.data.total.received_value}
      </Td>
      <Td>
        <CustomButton mt="0" label={t('Detalhes')} link={`${url}/${advance.id}`} size="sm" />
      </Td>
    </Tr>
  );
};

interface AdvancesTableProps {
  advances?: WithId<AccountAdvance>[] | null;
}

export const AdvancesTable = ({ advances }: AdvancesTableProps) => {
  // helpers
  const formatCents = (value: string) => {
    let result = 0;
    if (value.includes('R$')) {
      result = parseFloat(value.split(' ')[1].replace(',', '.')) * 100;
    } else {
      result = parseFloat(value.split(' ')[0].replace(',', '.')) * 100;
    }
    return result;
  };
  const totalRequested =
    advances?.reduce<number>((result, item) => {
      const value = formatCents(item.data.total.advanced_value);
      return (result += value);
    }, 0) ?? 0;
  const totalFees =
    advances?.reduce<number>((result, item) => {
      const value = formatCents(item.data.total.advance_fee);
      return (result += value);
    }, 0) ?? 0;
  const totalAdvanced =
    advances?.reduce<number>((result, item) => {
      const value = formatCents(item.data.total.received_value);
      return (result += value);
    }, 0) ?? 0;
  // UI
  return (
    <Table mt="4" size="md" variant="simple">
      <Tbody>
        <Tr fontSize="15px" lineHeight="21px" fontWeight="500">
          <Td>{t('Data')}</Td>
          <Td isNumeric>{t('Valor solicitado')}</Td>
          <Td isNumeric>{t('Taxa de antecipação')}</Td>
          <Td isNumeric>{t('Valor antecipado')}</Td>
          <Td></Td>
        </Tr>
        {advances !== undefined ? (
          advances !== null ? (
            advances.map((advance) => <AdvancesTableItem key={advance.id} advance={advance} />)
          ) : (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Sem resultados para o mês informado')}</Td>
              <Td isNumeric></Td>
              <Td isNumeric></Td>
              <Td isNumeric></Td>
              <Td></Td>
            </Tr>
          )
        ) : (
          <Tr color="black" fontSize="xs" fontWeight="700">
            <Td>{t('Carregando...')}</Td>
            <Td></Td>
            <Td></Td>
            <Td></Td>
            <Td></Td>
          </Tr>
        )}
      </Tbody>
      <Tfoot bgColor="gray.50">
        <Tr>
          <Th>{t('Total')}</Th>
          <Th color="black" isNumeric>
            {formatCurrency(totalRequested)}
          </Th>
          <Th color="red" isNumeric>
            - {formatCurrency(totalFees)}
          </Th>
          <Th color="green.700" isNumeric>
            {formatCurrency(totalAdvanced)}
          </Th>
          <Th></Th>
        </Tr>
      </Tfoot>
    </Table>
  );
};
