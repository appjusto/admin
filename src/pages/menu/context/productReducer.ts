import { BusinessSchedule, Product } from '@appjusto/types';
import { Availability } from '../drawers/product/ProductAvailability';

export interface ProductStateProps {
  //product
  product: {
    name: string;
    description: string;
    price: number;
    classifications: string[];
    externalId: string;
    enabled: boolean;
    imageExists: boolean;
    complementsEnabled: boolean;
    complementsGroupsIds: string[];
    availability: BusinessSchedule;
  };
  //details
  categoryId: string;
  imageFiles: File[] | null;
  mainAvailability?: Availability;
  saveSuccess: boolean;
}

export type Actions =
  | { type: 'update_state'; payload: Partial<ProductStateProps> }
  | { type: 'update_product'; payload: Partial<Product> };

export const productReducer = (
  state: ProductStateProps,
  action: Actions
): ProductStateProps => {
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
