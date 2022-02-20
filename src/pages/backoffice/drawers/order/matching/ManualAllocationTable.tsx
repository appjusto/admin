import { CourierProfile, WithId } from '@appjusto/types';
import { Button, Icon, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import React from 'react';
import { t } from 'utils/i18n';

interface ManualAllocationTableProps {
  couriers?: WithId<CourierProfile>[] | null;
  allocationFn(courierId: string): void;
  isLoading: boolean;
}

export const ManualAllocationTable = ({
  couriers,
  allocationFn,
  isLoading,
}: ManualAllocationTableProps) => {
  // UI
  return (
    <Table mt="4" size="md" variant="simple">
      <Thead>
        <Tr>
          <Th>{t('ID')}</Th>
          <Th>{t('Nome')}</Th>
          <Th>{t('Live')}</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {couriers && couriers.length > 0 ? (
          couriers.map((courier) => (
            <Tr key={courier.id} color="black" fontSize="xs">
              <Td>{courier.code}</Td>
              <Td>{courier.name}</Td>
              <Td>
                <Icon
                  mt="-2px"
                  viewBox="0 0 200 200"
                  color={courier?.status === 'available' ? 'green.500' : 'gray.50'}
                >
                  <path
                    fill="currentColor"
                    d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
                  />
                </Icon>
              </Td>
              <Td maxW="145px">
                <Button
                  size="sm"
                  onClick={() => allocationFn(courier.id)}
                  isLoading={isLoading}
                  isDisabled={courier?.status !== 'available'}
                >
                  {t('Alocar entregador')}
                </Button>
              </Td>
            </Tr>
          ))
        ) : (
          <Tr color="black" fontSize="xs" fontWeight="700">
            <Td>{t('Entregador não encontrado')}</Td>
            <Td></Td>
            <Td></Td>
            <Td></Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
};
