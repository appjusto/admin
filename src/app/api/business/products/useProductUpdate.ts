import { useContextBusinessId } from 'app/state/business/context';
import { Product } from 'appjusto-types';
import { useMutation } from 'react-query';
import { useContextApi } from '../../../state/api/context';

export const useProductUpdate = (productId: string) => {
  // context
  const api = useContextApi()!;
  const businessId = useContextBusinessId()!;

  // mutations
  const [updateProduct, result] = useMutation((changes: Partial<Product>) =>
    api.business().updateProduct(businessId, productId, changes)
  );

  // return
  return { updateProduct, result };
};
