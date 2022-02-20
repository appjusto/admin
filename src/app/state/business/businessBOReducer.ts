import { WithId, Business, ManagerProfile, BankAccount } from '@appjusto/types';

export interface businessBOState {
  manager: WithId<ManagerProfile>;
  bankingInfo: Partial<BankAccount>;
  businessProfile: WithId<Business>;
}

export type Actions =
  | { type: 'load_business'; payload: WithId<Business> }
  | { type: 'update_business'; payload: Partial<WithId<Business>> }
  | { type: 'clear_business' }
  | { type: 'load_manager'; payload: WithId<ManagerProfile> }
  | { type: 'update_manager'; payload: Partial<WithId<ManagerProfile>> }
  | { type: 'clear_manager' }
  | { type: 'update_banking'; payload: Partial<BankAccount> }
  | { type: 'clear_banking' };

export const businessBOReducer = (state: businessBOState, action: Actions): businessBOState => {
  switch (action.type) {
    case 'load_business':
      return {
        ...state,
        businessProfile: {
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
    case 'clear_business':
      return {
        ...state,
        businessProfile: {} as WithId<Business>,
      };
    case 'load_manager':
      return {
        ...state,
        manager: {
          ...action.payload,
        },
      };
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
          ...action.payload,
        },
      };
    case 'clear_banking':
      return {
        ...state,
        bankingInfo: {} as WithId<BankAccount>,
      };
    default:
      throw new Error();
  }
};
