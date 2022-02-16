import { FlaggedLocationsAlgolia } from '@appjusto/types';
import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { t } from 'utils/i18n';
import { FlaggedLocationsTableItem } from './FlaggedLocationsTableItem';

interface FlaggedLocationsTableProps {
  locations?: FlaggedLocationsAlgolia[] | null;
  refetch(): void;
}

export const FlaggedLocationsTable = ({ locations, refetch }: FlaggedLocationsTableProps) => {
  // context
  // UI
  return (
    <Box mt="6" maxW="100vw" overflowX="auto">
      <Table size="md" variant="simple" pos="relative">
        <Thead>
          <Tr>
            <Th>{t('Adicionado em')}</Th>
            <Th>{t('Endereço principal')}</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {locations && locations.length > 0 ? (
            locations.map((location) => (
              <FlaggedLocationsTableItem
                key={location.objectID}
                location={location}
                refetch={refetch}
              />
            ))
          ) : (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Sem resultados para os dados informados')}</Td>
              <Td></Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};
