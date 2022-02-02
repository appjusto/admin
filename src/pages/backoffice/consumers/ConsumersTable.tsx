import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { ConsumerAlgolia } from 'appjusto-types';
import { t } from 'utils/i18n';
import { ConsumersTableItem } from './ConsumersTableItem';

interface ConsumersTableProps {
  consumers: ConsumerAlgolia[] | undefined;
}

export const ConsumersTable = ({ consumers }: ConsumersTableProps) => {
  // context

  // UI
  return (
    <Box mt="12" overflowX="auto">
      <Table mt="4" size="md" variant="simple">
        <Thead>
          <Tr>
            <Th>{t('ID')}</Th>
            <Th>{t('Data do onboarding')}</Th>
            <Th>{t('Nome do cliente')}</Th>
            <Th isNumeric>{t('Qtd. pedidos')}</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {consumers && consumers.length > 0 ? (
            consumers.map((consumer) => {
              return <ConsumersTableItem key={consumer.objectID} consumer={consumer} />;
            })
          ) : (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('A busca não encontrou resultados')}</Td>
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
