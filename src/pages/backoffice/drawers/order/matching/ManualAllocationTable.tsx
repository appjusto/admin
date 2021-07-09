import { Button, Icon, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { CourierAlgolia } from 'appjusto-types';
import React from 'react';
import { t } from 'utils/i18n';

interface ManualAllocationTableProps {
  couriers?: CourierAlgolia[];
}

export const ManualAllocationTable = ({ couriers }: ManualAllocationTableProps) => {
  if (!couriers)
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
          <Tr color="black" fontSize="xs" fontWeight="700">
            <Td>{t('Carregando registros...')}</Td>
          </Tr>
        </Tbody>
      </Table>
    );
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
            <Tr key={courier.objectID} color="black" fontSize="xs">
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
              <Td>
                <Button size="sm">{t('Alocar entregador')}</Button>
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
