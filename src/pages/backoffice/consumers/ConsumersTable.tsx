import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { ConsumerProfile, WithId } from 'appjusto-types';
import { t } from 'utils/i18n';
import { ConsumersTableItem } from './ConsumersTableItem';

interface ConsumersTableProps {
  consumers: WithId<ConsumerProfile>[] | undefined;
}

export const ConsumersTable = ({ consumers }: ConsumersTableProps) => {
  // context

  // UI
  return (
    <Box mt="12">
      <Table mt="4" size="md" variant="simple">
        <Thead>
          <Tr>
            <Th>{t('ID')}</Th>
            <Th>{t('Data do onboarding')}</Th>
            <Th>{t('Nome do restaurante')}</Th>
            <Th>{t('Qtd. pedidos')}</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {consumers && consumers.length > 0 ? (
            consumers.map((consumer) => {
              return <ConsumersTableItem key={consumer.id} consumer={consumer} />;
            })
          ) : (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Sem resultados para o número informado')}</Td>
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
