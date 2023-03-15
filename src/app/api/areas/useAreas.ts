import { Area } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useAreas = () => {
  // context
  const api = useContextApi();
  // mutations
  const { mutate: updateArea, mutationResult: updateAreaResult } =
    useCustomMutation(async (data: { id?: string; changes: Partial<Area> }) => {
      const { id, changes } = data;
      if (!id) {
        return await api.areas().createArea(changes);
      }
      return await api.areas().updateArea(id, changes);
    }, 'updateArea');
  const { mutate: deleteArea, mutationResult: deleteAreaResult } =
    useCustomMutation(async (id: string) => {
      return await api.areas().deleteArea(id);
    }, 'updateArea');
  // result
  return {
    updateArea,
    updateAreaResult,
    deleteArea,
    deleteAreaResult,
  };
};
