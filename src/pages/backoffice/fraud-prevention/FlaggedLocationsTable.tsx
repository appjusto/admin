import { Box, Button, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
//import { FlaggedLocation, WithId } from 'appjusto-types';
import { getAlgoliaFieldDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { FlaggedLocationsAlgolia } from '.';

interface FlaggedLocationsTableProps {
  //locations?: WithId<FlaggedLocation>[] | null;
  locations?: FlaggedLocationsAlgolia[] | null;
}

export const FlaggedLocationsTable = ({ locations }: FlaggedLocationsTableProps) => {
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
            locations.map((location) => {
              return (
                <Tr key={location.objectID} color="black" fontSize="15px" lineHeight="21px">
                  <Td>{getAlgoliaFieldDateAndHour(location.date_timestamp)}</Td>
                  <Td>{location.description}</Td>
                  <Td>
                    <Button mt="0" variant="dangerLight" size="sm">
                      {t('Remover')}
                    </Button>
                  </Td>
                </Tr>
              );
            })
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
