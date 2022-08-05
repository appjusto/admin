import { StaffProfile, WithId } from '@appjusto/types';
import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import React from 'react';
import { t } from 'utils/i18n';
import { StaffsTableItem } from './StaffsTableItem';

interface StaffsTableProps {
  staffs?: WithId<StaffProfile>[];
}

export const StaffsTable = ({ staffs }: StaffsTableProps) => {
  // UI
  return (
    <Box mt="8">
      <Table mt="4" size="md" variant="simple">
        <Thead>
          <Tr>
            <Th>{t('E-mail')}</Th>
            <Th>{t('Situação')}</Th>
            <Th>{t('Nome')}</Th>
            <Th>{t('Telefone')}</Th>
            <Th>{t('Adicionado em')}</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {staffs === undefined ? (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Carregando agentes...')}</Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          ) : staffs.length > 0 ? (
            staffs.map((staff) => {
              return <StaffsTableItem key={staff.id} staff={staff} />;
            })
          ) : (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Não há agentes adicionados.')}</Td>
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
