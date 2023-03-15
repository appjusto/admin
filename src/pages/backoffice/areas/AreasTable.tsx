import { Area, WithId } from '@appjusto/types';
import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { t } from 'utils/i18n';
import { AreasTableItem } from './AreasTableItem';

interface AreasTableProps {
  areas: WithId<Area>[];
}

export const AreasTable = ({ areas }: AreasTableProps) => {
  // UI
  return (
    <Box mt="12" maxW="100vw" overflowX="auto">
      <Table mt="4" size="md" variant="simple" pos="relative">
        <Thead>
          <Tr>
            <Th>{t('Estado')}</Th>
            <Th>{t('Cidade')}</Th>
            <Th>{t('Criada em')}</Th>
            <Th>{t('Logística')}</Th>
            <Th>{t('Cobertura')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {areas.length > 0 ? (
            areas.map((area) => {
              return <AreasTableItem key={area.id} area={area} />;
            })
          ) : (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Nenhuma área encontrada')}</Td>
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
