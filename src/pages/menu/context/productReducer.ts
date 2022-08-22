import { Product } from '@appjusto/types';

export interface StateProps {
  //product
  product: {
    name: string;
    description: string;
    price: number;
    classifications: string[];
    externalId: string;
    enabled: boolean;
    complementsEnabled: boolean;
    imageExists: boolean;
  };
  //details
  categoryId: string;
  imageFiles: File[] | null;
  saveSuccess: boolean;
}

export type Actions =
  | { type: 'update_state'; payload: Partial<StateProps> }
  | { type: 'update_product'; payload: Partial<Product> };

export const productReducer = (
  state: StateProps,
  action: Actions
): StateProps => {
  switch (action.type) {
    case 'update_state':
      return {
        ...state,
        ...action.payload,
      };
    case 'update_product':
      return {
        ...state,
        product: {
          ...state.product,
          ...action.payload,
        },
      };
    default:
      throw new Error();
  }
};
