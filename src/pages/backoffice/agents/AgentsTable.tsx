import {
  Box,
  Button,
  HStack,
  RadioGroup,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { WithId } from 'appjusto-types';
import CustomRadio from 'common/components/form/CustomRadio';
import React from 'react';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { Agent } from './AgentsPage';

interface AgentsTableProps {
  agents: WithId<Agent>[];
}

interface AgentTableItemProps {
  agent: WithId<Agent>;
  updateAgent(agentId: string, role: string): void;
  deleteAgent(agentId: string): void;
}

const AgentTableItem = ({ agent, updateAgent, deleteAgent }: AgentTableItemProps) => {
  // state
  const [isDeleting, setIsDeleting] = React.useState(false);
  // handlers

  // UI
  return (
    <Tr
      key={agent.email}
      color="black"
      fontSize="sm"
      h="66px"
      bg={isDeleting ? 'rgba(254, 215, 215, 0.3)' : 'none'}
    >
      <Td>{agent.email}</Td>
      {isDeleting ? (
        <>
          <Td>{t('Confirmar exclusão?')}</Td>
          <Td position="relative">
            <Box position="absolute" top="4">
              <HStack spacing={4}>
                <Button w="150px" size="sm" onClick={() => setIsDeleting(false)}>
                  {t('Manter')}
                </Button>
                <Button w="150px" size="sm" variant="danger" onClick={() => deleteAgent(agent.id)}>
                  {t('Excluir')}
                </Button>
              </HStack>
            </Box>
          </Td>
          <Td></Td>
        </>
      ) : (
        <>
          <Td>
            <RadioGroup
              onChange={(value) => updateAgent(agent.id, value as string)}
              value={agent.role}
              defaultValue="1"
              colorScheme="green"
              color="black"
              fontSize="15px"
              lineHeight="21px"
            >
              <HStack
                alignItems="flex-start"
                color="black"
                spacing={8}
                fontSize="16px"
                lineHeight="22px"
              >
                <CustomRadio value="owner">{t('Owner')}</CustomRadio>
                <CustomRadio value="staff">{t('Staff')}</CustomRadio>
                <CustomRadio value="viewer">{t('Viewer')}</CustomRadio>
              </HStack>
            </RadioGroup>
          </Td>
          <Td>{getDateAndHour(agent.createdOn)}</Td>
          <Td>
            <Button size="sm" variant="dangerLight" onClick={() => setIsDeleting(true)}>
              {t('Excluir colaborador')}
            </Button>
          </Td>
        </>
      )}
    </Tr>
  );
};

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
        {t('Colaboradores adicionados')}
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
          {agents && agents.length > 0 ? (
            agents.map((agent) => {
              return (
                <AgentTableItem
                  key={agent.id}
                  agent={agent}
                  updateAgent={updateAgent}
                  deleteAgent={deleteAgent}
                />
              );
            })
          ) : (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Não há colaboradores adicionados.')}</Td>
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
