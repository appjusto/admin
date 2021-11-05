import { useServerTime } from 'app/api/platform/useServerTime';
import React from 'react';
import { useContextFirebaseUser } from '../auth/context';

interface ServerTimeContextProps {
  getServerTime: () => Date;
}

const ServerTimeContext = React.createContext<ServerTimeContextProps>({} as ServerTimeContextProps);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const ServerTimeProvider = ({ children }: Props) => {
  // context
  const { user } = useContextFirebaseUser();
  const isAuthed = user !== undefined && user !== null;
  const getServerTime = useServerTime(isAuthed);
  // provider
  return (
    <ServerTimeContext.Provider value={{ getServerTime }}>{children}</ServerTimeContext.Provider>
  );
};

export const useContextServerTime = () => {
  return React.useContext(ServerTimeContext);
};
