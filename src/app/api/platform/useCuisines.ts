import { useContextApi } from 'app/state/api/context';
import { useQuery } from 'react-query';

export const useCuisines = () => {
  const api = useContextApi();
  const fetchCuisines = () => api.platform().fetchCuisines();
  const { data } = useQuery(['cuisines'], fetchCuisines);
  return data ?? [];
};
