import { WithId, ConsumerProfile } from 'appjusto-types';

export type Actions = { type: 'update_state'; payload: Partial<WithId<ConsumerProfile>> };

export const consumerReducer = (
  state: WithId<ConsumerProfile>,
  action: Actions
): WithId<ConsumerProfile> => {
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
