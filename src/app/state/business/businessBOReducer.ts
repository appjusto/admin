import { WithId, Business } from 'appjusto-types';

export type Actions = { type: 'update_state'; payload: Partial<WithId<Business>> };

export const businessBOReducer = (state: WithId<Business>, action: Actions): WithId<Business> => {
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
