import { Fleet } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useFleet = () => {
  // contex
  const api = useContextApi();
  // mutations
  const { mutateAsync: updateFleet, mutationResult: updateFleetResult } =
    useCustomMutation(
      async (data: {
        changes: Partial<Fleet>;
        id?: string;
      }): Promise<string | null | void> => {
        if (!data.id) return api.fleet().createFleet(data.changes);
        else return api.fleet().updateFleet(data.id, data.changes);
      },
      'updateFleet',
      false
    );
  // return
  return { updateFleet, updateFleetResult };
};
