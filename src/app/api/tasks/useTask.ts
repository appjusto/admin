import { useContextApi } from 'app/state/api/context';
import { useQuery } from 'react-query';

export const useTask = (orderId: string | undefined, type: string) => {
  // context
  const api = useContextApi();
  // queries
  const getOrderTaskByType = () => {
    if(!orderId) return;
    return api.tasks().getOrderTaskByType(orderId, type)
  }
  const { data: task } = useQuery(['task', orderId, type], getOrderTaskByType);
  // return
  return task;
};
