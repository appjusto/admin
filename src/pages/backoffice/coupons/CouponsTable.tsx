import { Coupon, WithId } from '@appjusto/types';
import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
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
            <Th>{t('Status')}</Th>
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
    </Box>
  );
};
