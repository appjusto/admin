import { CourierAlgolia } from '@appjusto/types';
import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { t } from 'utils/i18n';
import { CouriersTableItem } from './CouriersTableItem';

interface CouriersTableProps {
  couriers: CourierAlgolia[] | undefined;
}

export const CouriersTable = ({ couriers }: CouriersTableProps) => {
  // context

  // UI
  return (
    <Box mt="12" overflowX="auto">
      <Table mt="4" size="md" variant="simple">
        <Thead>
          <Tr>
            <Th>{t('ID')}</Th>
            <Th>{t('Data do onboarding')}</Th>
            <Th>{t('Nome')}</Th>
            <Th>{t('Status')}</Th>
            <Th>{t('Live')}</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {couriers && couriers.length > 0 ? (
            couriers.map((courier) => {
              return <CouriersTableItem key={courier.objectID} courier={courier} />;
            })
          ) : (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('A busca não encontrou resultados')}</Td>
              <Td></Td>
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
