import { useBusinessId } from 'app/state/business/context';
import { Product } from 'appjusto-types';
import { useMutation } from 'react-query';
import { useApi } from '../../../state/api/context';

export const useProductUpdate = (productId: string) => {
  // context
  const api = useApi()!;
  const businessId = useBusinessId()!;

  // mutations
  const [updateProduct, result] = useMutation((changes: Partial<Product>) =>
    api.business().updateProduct(businessId, productId, changes)
  );

  // return
  return { updateProduct, result };
};
