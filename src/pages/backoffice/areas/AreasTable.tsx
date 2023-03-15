import { Area, WithId } from '@appjusto/types';
import {
  Box,
  HStack,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
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
            <Th>{t('Cobertura')}</Th>
            <Th textAlign="center">{t('Logística')}</Th>
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
      <HStack mt="8" spacing={6}>
        <Text fontSize="sm">
          <Icon mt="-3px" viewBox="0 0 200 200" color="green.500">
            <path
              fill="currentColor"
              d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
            />
          </Icon>
          {t(' Logística AppJusto')}
        </Text>
        <Text fontSize="sm">
          <Icon mt="-3px" viewBox="0 0 200 200" color="#FFBE00">
            <path
              fill="currentColor"
              d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
            />
          </Icon>
          {t(' Logística Externa')}
        </Text>
        <Text fontSize="sm">
          <Icon mt="-3px" viewBox="0 0 200 200" color="gray.200">
            <path
              fill="currentColor"
              d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
            />
          </Icon>
          {t(' Sem logística')}
        </Text>
      </HStack>
    </Box>
  );
};
