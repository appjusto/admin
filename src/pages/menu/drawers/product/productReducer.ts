import React from 'react';

export interface StateProps {
  name: string;
  categoryId: string | undefined;
  description?: string;
  price: number;
  pdvCod: string;
  classifications: React.ReactText[];
  imageUrl?: string | undefined;
  previewURL?: string | undefined;
  externalId?: string;
  enabled: boolean;
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
