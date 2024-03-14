import { Coupon, WithId } from '@appjusto/types';
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
import { CouponsTableItem } from './CouponsTableItem';

interface CouponsTableProps {
  coupons: WithId<Coupon>[];
}

export const CouponsTable = ({ coupons }: CouponsTableProps) => {
  // UI
  return (
    <Box mt="12" maxW="100vw" overflowX="auto">
      <Table mt="4" size="md" variant="simple" pos="relative">
        <Thead>
          <Tr>
            <Th>{t('Código')}</Th>
            <Th>{t('Tipo')}</Th>
            <Th>{t('Criada em')}</Th>
            <Th textAlign="center">{t('Status')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {coupons.length > 0 ? (
            coupons.map((coupon) => {
              return <CouponsTableItem key={coupon.id} coupon={coupon} />;
            })
          ) : (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Nenhum cupom encontrado')}</Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      <HStack mt="8" spacing={6}>
        <Text fontSize="sm">
          <Icon mt="-3px" mr="2" viewBox="0 0 200 200" color="green.500">
            <path
              fill="currentColor"
              d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
            />
          </Icon>
          {t('Ativado')}
        </Text>
        <Text fontSize="sm">
          <Icon mt="-3px" mr="2" viewBox="0 0 200 200" color="gray.200">
            <path
              fill="currentColor"
              d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
            />
          </Icon>
          {t('Desativado')}
        </Text>
      </HStack>
    </Box>
  );
};
