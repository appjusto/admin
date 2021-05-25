import { WithId, Business, ManagerProfile, BankAccount } from 'appjusto-types';

export interface businessBOState {
  manager: WithId<ManagerProfile>;
  bankingInfo: WithId<BankAccount>;
  businessProfile: WithId<Business>;
}

export type Actions =
  | { type: 'update_manager'; payload: Partial<WithId<ManagerProfile>> }
  | { type: 'clear_manager' }
  | { type: 'update_banking'; payload: Partial<WithId<BankAccount>> }
  | { type: 'update_business'; payload: Partial<WithId<Business>> };

export const businessBOReducer = (state: businessBOState, action: Actions): businessBOState => {
  switch (action.type) {
    case 'update_manager':
      return {
        ...state,
        manager: {
          ...state.manager,
          ...action.payload,
        },
      };
    case 'clear_manager':
      return {
        ...state,
        manager: {} as WithId<ManagerProfile>,
      };
    case 'update_banking':
      return {
        ...state,
        bankingInfo: {
          ...state.bankingInfo,
          ...action.payload,
        },
      };
    case 'update_business':
      return {
        ...state,
        businessProfile: {
          ...state.businessProfile,
          ...action.payload,
        },
      };
    default:
      throw new Error();
  }
};
