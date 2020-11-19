import { useQuery } from 'react-query';
import { useApi } from '../context';

export const useProductsQuery = (categoryId: string) => {
  const api = useApi()!;
  const fetchProducts = (key: string) => api.menu().fetchProducts(categoryId);
  return useQuery(['category', categoryId], fetchProducts);
};
