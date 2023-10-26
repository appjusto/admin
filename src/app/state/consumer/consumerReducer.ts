import { ConsumerProfile, InstallReferrer, WithId } from '@appjusto/types';

export type Actions =
  | { type: 'load_state'; payload: WithId<ConsumerProfile> }
  | { type: 'update_state'; payload: Partial<WithId<ConsumerProfile>> }
  | { type: 'update_install_referrer'; payload: Partial<InstallReferrer> };

export const consumerReducer = (
  state: WithId<ConsumerProfile>,
  action: Actions
): WithId<ConsumerProfile> => {
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
    case 'update_install_referrer':
      return {
        ...state,
        installReferrer: {
          ...state.installReferrer,
          ...action.payload,
        },
      };
    default:
      throw new Error();
  }
};
