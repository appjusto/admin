import { useApi } from 'app/state/api/context';
import { useQuery } from 'react-query';

export const useBanks = () => {
  const api = useApi();
  const fetchBanks = (key: string) => api.platform().fetchBanks();
  const { data } = useQuery(['banks'], fetchBanks);
  return data ?? [];
}