import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { BusinessRecommendation, WithId } from 'appjusto-types';
import { t } from 'utils/i18n';
import { RecommendationsTableItem } from './RecommendationsTableItem';

interface RecommendationsTableProps {
  recommendations?: WithId<BusinessRecommendation>[] | null;
}

export const RecommendationsTable = ({ recommendations }: RecommendationsTableProps) => {
  // context

  // UI
  return (
    <Box mt="12" maxW="100vw" overflowX="auto">
      <Table mt="4" size="md" variant="simple" pos="relative">
        <Thead>
          <Tr>
            <Th maxW="130px">{t('Data')}</Th>
            <Th minW="200px">{t('Nome')}</Th>
            <Th minW="200px">{t('Responsável')}</Th>
            <Th minW="160px">{t('Telefone')}</Th>
            <Th maxW="120px">{t('Instagram')}</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {recommendations && recommendations.length > 0 ? (
            recommendations.map((recommendation) => {
              return (
                <RecommendationsTableItem key={recommendation.id} recommendation={recommendation} />
              );
            })
          ) : (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Sem resultados para o período informado')}</Td>
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
