import { WithId } from '@appjusto/types';
import { Box, Button, HStack, RadioGroup, Td, Tr } from '@chakra-ui/react';
import { AgentWithRole } from 'app/api/agent/types';
import CustomRadio from 'common/components/form/CustomRadio';
import React from 'react';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface AgentTableItemProps {
  agent: WithId<AgentWithRole>;
  updateAgent(agentId: string, role: string): void;
  deleteAgent(agentId: string): void;
}

export const AgentsTableItem = ({ agent, updateAgent, deleteAgent }: AgentTableItemProps) => {
  // state
  const [isDeleting, setIsDeleting] = React.useState(false);
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
