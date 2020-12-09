import { useApi } from 'app/state/api/context';
import { useQuery } from 'react-query';

export const useCuisines = () => {
  const api = useApi();
  const fetchCuisines = (key: string) => api.platform().fetchCuisines();
  const { data } = useQuery(['cuisines'], fetchCuisines);
  return data ?? [];
}