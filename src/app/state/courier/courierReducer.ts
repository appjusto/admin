import { WithId, CourierProfile } from 'appjusto-types';

export type Actions =
  | { type: 'load_state'; payload: WithId<CourierProfile> }
  | { type: 'update_state'; payload: Partial<WithId<CourierProfile>> };

export const courierReducer = (
  state: WithId<CourierProfile>,
  action: Actions
): WithId<CourierProfile> => {
  switch (action.type) {
    case 'load_state':
      return {
        ...action.payload,
      };
    case 'update_state':
      return {
        ...state,
        ...action.payload,
      };
    default:
      throw new Error();
  }
};
