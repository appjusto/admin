import { Ordering } from 'appjusto-types';

export interface StateProps {
  //product
  name: string;
  description: string;
  price: number;
  classifications: string[];
  externalId: string;
  enabled: boolean;
  complementsOrder: Ordering;
  complementsEnabled: boolean;
  imageExists: boolean;
  //details
  categoryId: string;
  imageFiles: File[] | null;
  isLoading: boolean;
  isEditing: boolean;
  saveSuccess: boolean;
}

export type Actions = { type: 'update_state'; payload: Partial<StateProps> };

export const productReducer = (state: StateProps, action: Actions): StateProps => {
  switch (action.type) {
    case 'update_state':
      return {
        ...state,
        ...action.payload,
      };
    default:
      throw new Error();
  }
};
