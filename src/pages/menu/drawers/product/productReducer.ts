import { MenuConfig } from 'appjusto-types';

export interface StateProps {
  //product
  name: string;
  description: string;
  price: number;
  classifications: string[];
  imageUrl: string | null;
  externalId: string;
  enabled: boolean;
  complementsOrder: MenuConfig;
  complementsEnabled: boolean;
  //details
  categoryId: string;
  previewURL: string | null;
  imageFile: File | null;
  isLoading: boolean;
  isEditing: boolean;
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
