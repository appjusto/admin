import { useAgentProfile } from 'app/api/agent/useAgentProfile';
import { ManagerProfile, WithId } from 'appjusto-types';
import React from 'react';

const AgentProfileContext = React.createContext<WithId<ManagerProfile> | undefined | null>(null);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const AgentProvider = ({ children }: Props) => {
  const profile = useAgentProfile();
  return <AgentProfileContext.Provider value={profile}>{children}</AgentProfileContext.Provider>;
};

export const useContextAgentProfile = () => {
  return React.useContext(AgentProfileContext);
};
