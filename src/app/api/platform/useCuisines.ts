import { useContextApi } from 'app/state/api/context';
import { useQuery } from 'react-query';

export const useCuisines = () => {
  const api = useContextApi();
  const fetchCuisines = (key: string) => api.platform().fetchCuisines();
  const { data } = useQuery(['cuisines'], fetchCuisines);
  return data ?? [];
};
