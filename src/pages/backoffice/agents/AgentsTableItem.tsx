import { WithId } from '@appjusto/types';
import { Td, Tr } from '@chakra-ui/react';
import { AgentWithRole } from 'app/api/agent/types';
import { CustomButton } from 'common/components/buttons/CustomButton';
import {
  cpfFormatter,
  phoneFormatter,
} from 'common/components/form/input/pattern-input/formatters';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface AgentTableItemProps {
  agent: WithId<AgentWithRole>;
}

export const AgentsTableItem = ({ agent }: AgentTableItemProps) => {
  // context
  const { path } = useRouteMatch();
  // state
  // UI
  return (
    <Tr key={agent.email} color="black" fontSize="sm" h="66px">
      <Td>{agent.email}</Td>
      <Td>{agent.name ?? 'N/I'}</Td>
      <Td>{agent.phone ? phoneFormatter(agent.phone) : 'N/I'}</Td>
      <Td>{agent.cpf ? cpfFormatter(agent.cpf) : 'N/I'}</Td>
      <Td>{getDateAndHour(agent.createdOn)}</Td>
      <Td>
        <CustomButton
          mt="0"
          variant="outline"
          label={t('Detalhes')}
          link={`${path}/${agent.id}`}
          size="sm"
        />
      </Td>
    </Tr>
  );
};
