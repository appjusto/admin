import { WithId } from '@appjusto/types';
import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { AgentWithRole } from 'app/api/agent/types';
import React from 'react';
import { t } from 'utils/i18n';
import { AgentsTableItem } from './AgentsTableItem';

interface AgentsTableProps {
  agents?: WithId<AgentWithRole>[];
}

export const AgentsTable = ({ agents }: AgentsTableProps) => {
  // context

  // state

  // handlers
  const updateAgent = (agentId: string, role: string) => {
    console.log('update', agentId, role);
  };

  const deleteAgent = (agentId: string) => {
    console.log('delete', agentId);
  };

  // side effects

  // UI
  return (
    <Box mt="8">
      <Text fontSize="lg" color="black">
        {t('Agentes adicionados')}
      </Text>
      <Table mt="4" size="md" variant="simple">
        <Thead>
          <Tr>
            <Th>{t('E-mail')}</Th>
            <Th>{t('Papel')}</Th>
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
            </Tr>
          ) : agents.length > 0 ? (
            agents.map((agent) => {
              return (
                <AgentsTableItem
                  key={agent.id}
                  agent={agent}
                  updateAgent={updateAgent}
                  deleteAgent={deleteAgent}
                />
              );
            })
          ) : (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Não há agentes adicionados.')}</Td>
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
