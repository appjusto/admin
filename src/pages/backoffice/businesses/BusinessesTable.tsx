import { Box, Circle, HStack, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
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
            <Th>{t('Situação')}</Th>
            <Th>{t('Etapa')}</Th>
            <Th>{t('Aberto')}</Th>
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
      <Box mt="6">
        <HStack>
          <Text>{t('Legenda:')}</Text>
          <Circle w="8px" h="8px" bgColor="green.500" />
          <Text>{t('aberto /')}</Text>
          <Circle w="8px" h="8px" bgColor="gray.50" />
          <Text>{t('fechado /')}</Text>
          <Circle w="8px" h="8px" bgColor="red" />
          <Text>{t('deveria estar aberto')}</Text>
        </HStack>
      </Box>
    </Box>
  );
};
