import { useAgentProfile } from 'app/api/agent/useAgentProfile';
import { ManagerProfile, WithId } from 'appjusto-types';
import React from 'react';

interface ContextProps {
  agent: WithId<ManagerProfile> | undefined | null;
  username: string;
}

const AgentProfileContext = React.createContext<ContextProps>({} as ContextProps);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const AgentProvider = ({ children }: Props) => {
  const agent = useAgentProfile();
  const username = agent?.name ?? (agent?.email ? agent?.email.split('@')[0] : '');
  return (
    <AgentProfileContext.Provider value={{ agent, username }}>
      {children}
    </AgentProfileContext.Provider>
  );
};

export const useContextAgentProfile = () => {
  return React.useContext(AgentProfileContext);
};
