import { Box, Button, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { FlaggedLocation, WithId } from 'appjusto-types';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface FlaggedLocationsTableProps {
  locations?: WithId<FlaggedLocation>[] | null;
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
                <Tr key={location.id} color="black" fontSize="15px" lineHeight="21px">
                  <Td>{getDateAndHour(location.createdOn)}</Td>
                  <Td>{location.address.description}</Td>
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
