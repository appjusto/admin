import { useContextApi } from 'app/state/api/context';
import { Role, AdminRole } from 'appjusto-types';
import { useMutation } from 'react-query';

type ManagerData = { email: string; key: string; role: Role | AdminRole };

export const useCreateManager = () => {
  // context
  const api = useContextApi();
  // mutations
  const [createManager, result] = useMutation(async (data: ManagerData) =>
    api.manager().createManager(data)
  );
  // return
  return { createManager, result };
};
