import { ManagerProfile, WithId } from '@appjusto/types';
import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import React from 'react';
import { t } from 'utils/i18n';
import { AgentsTableItem } from './AgentsTableItem';

interface AgentsTableProps {
  agents?: WithId<ManagerProfile>[];
}

export const AgentsTable = ({ agents }: AgentsTableProps) => {
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
          {agents === undefined ? (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Carregando agentes...')}</Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          ) : agents.length > 0 ? (
            agents.map((agent) => {
              return <AgentsTableItem key={agent.id} agent={agent} />;
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
