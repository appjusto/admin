import { useAgents } from 'app/api/agent/useAgents';
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
  const { agents } = useAgents();
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
