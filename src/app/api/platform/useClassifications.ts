import { useContextApi } from 'app/state/api/context';
import { useQuery } from 'react-query';

export const useClassifications = () => {
  const api = useContextApi();
  const fetchClassifications = () => api.platform().fetchClassifications();
  const { data } = useQuery(['classifications'], fetchClassifications);
  return data ?? [];
};
