import { useContextApi } from 'app/state/api/context';
import { useQuery } from 'react-query';

export const useBanks = () => {
  const api = useContextApi();
  const fetchBanks = () => api.platform().fetchBanks();
  const { data } = useQuery(['banks'], fetchBanks);
  return data ?? [];
};
