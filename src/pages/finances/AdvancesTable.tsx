import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { AccountAdvance, WithId } from 'appjusto-types';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { useRouteMatch } from 'react-router-dom';
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
  // UI
  return (
    <Box mt="12">
      <Table mt="4" size="md" variant="simple">
        <Thead>
          <Tr>
            <Th>{t('Data')}</Th>
            <Th isNumeric>{t('Valor solicitado')}</Th>
            <Th isNumeric>{t('Taxa de antecipação')}</Th>
            <Th isNumeric>{t('Valor antecipado')}</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {advances !== undefined ? (
            advances !== null ? (
              advances.map((advance) => <AdvancesTableItem key={advance.id} advance={advance} />)
            ) : (
              <Tr color="black" fontSize="xs" fontWeight="700">
                <Td>{t('Sem resultados para o número informado')}</Td>
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
      </Table>
    </Box>
  );
};
