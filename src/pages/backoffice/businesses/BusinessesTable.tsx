import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { BusinessAlgolia } from 'appjusto-types';
import { t } from 'utils/i18n';
import { BusinessesTableItem } from './BusinessesTableItem';

interface BusinessesTableProps {
  businesses: BusinessAlgolia[] | undefined;
}

export const BusinessesTable = ({ businesses }: BusinessesTableProps) => {
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
            <Th>{t('Status')}</Th>
            <Th>{t('Etapa')}</Th>
            <Th>{t('Live')}</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {businesses && businesses.length > 0 ? (
            businesses.map((business) => {
              return <BusinessesTableItem key={business.objectID} business={business} />;
            })
          ) : (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('A busca não encontrou resultados')}</Td>
              <Td></Td>
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
