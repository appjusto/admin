import {
  BankAccount,
  Business,
  BusinessAddress,
  BusinessPhone,
  // ManagerProfile,
  WithId,
} from '@appjusto/types';
import { BusinessPhoneField } from 'pages/business-profile/business-phones';

const defaultPhone = {
  type: 'desk',
  number: '',
  calls: true,
  whatsapp: true,
} as BusinessPhone;

export interface businessBOState {
  // manager: WithId<ManagerProfile>;
  bankingInfo: Partial<BankAccount>;
  businessProfile: WithId<Business>;
}

export type Actions =
  | { type: 'load_business'; payload: WithId<Business> }
  | { type: 'update_business'; payload: Partial<WithId<Business>> }
  | { type: 'update_business_address'; payload: Partial<BusinessAddress> }
  | { type: 'add_business_phone' }
  | { type: 'remove_business_phone'; payload: number }
  | {
      type: 'update_business_phone';
      payload: { index: number; field: BusinessPhoneField; value: any };
    }
  | { type: 'ordering_business_phone'; payload: BusinessPhone[] }
  // | { type: 'load_manager'; payload: WithId<ManagerProfile> }
  // | { type: 'update_manager'; payload: Partial<WithId<ManagerProfile>> }
  | { type: 'update_banking'; payload: Partial<BankAccount> };

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
    case 'update_business_address':
      const { businessAddress } = state.businessProfile;
      return {
        ...state,
        businessProfile: {
          ...state.businessProfile,
          businessAddress: {
            ...businessAddress!,
            ...action.payload,
          },
        },
      };
    case 'add_business_phone':
      return {
        ...state,
        businessProfile: {
          ...state.businessProfile,
          phones: [...(state.businessProfile.phones ?? []), defaultPhone],
        },
      };
    case 'remove_business_phone':
      return {
        ...state,
        businessProfile: {
          ...state.businessProfile,
          phones: [...(state.businessProfile.phones ?? [])].filter(
            (item, index) => index !== action.payload
          ),
        },
      };
    case 'update_business_phone':
      return {
        ...state,
        businessProfile: {
          ...state.businessProfile,
          phones: [...(state.businessProfile.phones ?? [])].map((phone, index) => {
            if (index === action.payload.index) {
              return { ...phone, [action.payload.field]: action.payload.value };
            } else {
              return phone;
            }
          }),
        },
      };
    case 'ordering_business_phone':
      return {
        ...state,
        businessProfile: {
          ...state.businessProfile,
          phones: action.payload,
        },
      };
    // case 'load_manager':
    //   return {
    //     ...state,
    //     manager: {
    //       ...action.payload,
    //     },
    //   };
    // case 'update_manager':
    //   return {
    //     ...state,
    //     manager: {
    //       ...state.manager,
    //       ...action.payload,
    //     },
    //   };
    case 'update_banking':
      return {
        ...state,
        bankingInfo: {
          ...action.payload,
        },
      };
    default:
      throw new Error();
  }
};
