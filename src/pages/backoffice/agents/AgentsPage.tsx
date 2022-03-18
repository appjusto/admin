import { WithId } from '@appjusto/types';
import { useContextAgentProfile } from 'app/state/agent/context';
import { FieldValue } from 'firebase/firestore';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { t } from 'utils/i18n';
import { AddAgentsForm } from './AddAgentsForm';
import { AgentsTable } from './AgentsTable';

export type AgentRole = 'owner' | 'staff' | 'viewer';
export interface Agent {
  email: string;
  role: AgentRole;
  createdOn: FieldValue;
}

const AgentsPage = () => {
  // context
  const { agent } = useContextAgentProfile();
  // state
  const [agents, setAgents] = React.useState<WithId<Agent>[]>([]);
  // side effects
  React.useEffect(() => {
    if (agent) {
      const fakeMembers = [
        {
          id: agent.id,
          email: agent.email ?? 'não encontrado',
          role: 'owner' as AgentRole,
          createdOn: agent.createdOn,
        },
      ];
      setAgents(fakeMembers);
    }
  }, [agent]);

  // UI
  return (
    <>
      <PageHeader
        title={t('Agentes Appjusto')}
        subtitle={t(
          'Gerencie as pessoas que terão acesso ao Backoffice. Somente os agentes com papel "owner" podem incluir novos agentes.'
        )}
      />
      <AgentsTable agents={agents} />
      <AddAgentsForm />
    </>
  );
};

export default AgentsPage;
