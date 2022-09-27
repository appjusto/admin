import {
  BankAccount,
  Business,
  BusinessPhone,
  ManagerProfile,
  ManagerWithRole,
  MarketplaceAccountInfo,
  WithId,
} from '@appjusto/types';
import * as cnpjutils from '@fnando/cnpj';
import { useBusinessBankAccount } from 'app/api/business/profile/useBusinessBankAccount';
import { useBusinessManagerAndBankAccountBatch } from 'app/api/business/profile/useBusinessManagerAndBankAccountBatch';
import { useBusinessMarketPlace } from 'app/api/business/useBusinessMarketPlace';
import { useGetManagers } from 'app/api/manager/useGetManagers';
import { MutationResult } from 'app/api/mutation/useCustomMutation';
import { BackofficeProfileValidation } from 'common/types';
import { isEmpty, isEqual, pick } from 'lodash';
import { BusinessPhoneField } from 'pages/business-profile/business-phones';
import React, { Dispatch, SetStateAction } from 'react';
import { UseMutateAsyncFunction } from 'react-query';
import { useParams } from 'react-router';
import { useContextManagerProfile } from '../manager/context';
import { useContextAppRequests } from '../requests/context';
import { businessBOReducer, businessBOState } from './businessBOReducer';
import { useContextBusiness } from './context';
import { bankingInfoIsEmpty, getValidationStatus } from './utils';

const bankAccountSet = (bankAccount: BankAccount): boolean => {
  return (
    !isEmpty(bankAccount.name) &&
    !isEmpty(bankAccount.agency) &&
    !isEmpty(bankAccount.account)
  );
};

interface BusinessBOContextProps {
  manager?: WithId<ManagerProfile> | null;
  bankAccount?: Partial<BankAccount> | null;
  business?: WithId<Business> | null;
  contextValidation: BackofficeProfileValidation;
  isLoading: boolean;
  handleBusinessProfileChange(key: string, value: any): void;
  handleBussinesPhonesChange(
    operation: 'add' | 'remove' | 'update' | 'ordering',
    args?: number | { index: number; field: BusinessPhoneField; value: any }
  ): void;
  handleBusinessPhoneOrdering(newPhones: BusinessPhone[]): void;
  // handleManagerProfileChange(key: string, value: any): void;
  handleBusinessAddressChange(key: string, value: any): void;
  handleBankingInfoChange(newBankAccount: Partial<BankAccount>): void;
  setContextValidation: Dispatch<SetStateAction<BackofficeProfileValidation>>;
  handleSave(): void;
  marketPlace?: MarketplaceAccountInfo | null;
  deleteMarketPlace: UseMutateAsyncFunction<void, unknown, void, unknown>;
  deleteMarketPlaceResult: MutationResult;
  businessManagers?: ManagerWithRole[];
  // setIsGetManagersActive: React.Dispatch<React.SetStateAction<boolean>>;
  fetchManagers(): void;
}

const BusinessBOContext = React.createContext<BusinessBOContextProps>(
  {} as BusinessBOContextProps
);

const businessKeys: (keyof Business)[] = [
  'accountManagerId',
  'situation',
  'status',
  'enabled',
  'preparationModes',
  'fulfillment',
  'phones',
  'averageDiscount',
  'averageCookingTime',
  'profileIssues',
  'profileIssuesMessage',
  'settings',
  'businessAddress',
  'name',
  'description',
  'cuisine',
  'cnpj',
  'companyName',
  'deliveryRange',
  'minimumOrder',
  'tags',
  'maxOrdersPerHour',
  'minHoursForScheduledOrders',
  'reviews',
];
interface Props {
  children: React.ReactNode | React.ReactNode[];
}

type Params = {
  businessId: string;
};

export const BusinessBOProvider = ({ children }: Props) => {
  // context
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { businessId } = useParams<Params>();
  const { business, setBusinessId, clearBusiness, fetchManagers } =
    useContextBusiness();
  const { managers: businessManagers } = useGetManagers(
    businessId,
    business?.managers,
    true
  );
  const { manager, setManagerEmail } = useContextManagerProfile();
  const { bankAccount } = useBusinessBankAccount();
  const { marketPlace, deleteMarketPlace, deleteMarketPlaceResult } =
    useBusinessMarketPlace(businessId);
  const { updateBusinessManagerAndBankAccount, updateResult } =
    useBusinessManagerAndBankAccountBatch();
  // state
  const [state, dispatch] = React.useReducer(
    businessBOReducer,
    {} as businessBOState
  );
  const [contextValidation, setContextValidation] =
    React.useState<BackofficeProfileValidation>({
      cnpj: true,
      profile: true,
      cep: true,
      address: true,
      deliveryRange: true,
      agency: true,
      account: true,
    });
  // handlers
  const handleBusinessProfileChange = React.useCallback(
    (key: string, value: any) => {
      if (key === 'situation' && value === 'blocked') {
        dispatch({
          type: 'update_business',
          payload: { situation: 'blocked', enabled: false, status: 'closed' },
        });
      } else dispatch({ type: 'update_business', payload: { [key]: value } });
    },
    []
  );
  const handleBusinessAddressChange = React.useCallback(
    (key: string, value: any) => {
      dispatch({ type: 'update_business_address', payload: { [key]: value } });
    },
    []
  );
  const handleBussinesPhonesChange = (
    operation: 'add' | 'remove' | 'update' | 'ordering',
    args?: number | { index: number; field: BusinessPhoneField; value: any }
  ) => {
    if (operation === 'add') {
      return dispatch({ type: 'add_business_phone' });
    } else if (operation === 'remove' && typeof args === 'number') {
      return dispatch({ type: 'remove_business_phone', payload: args });
    } else if (operation === 'update' && args && typeof args !== 'number') {
      return dispatch({
        type: 'update_business_phone',
        payload: args as {
          index: number;
          field: BusinessPhoneField;
          value: any;
        },
      });
    }
    dispatchAppRequestResult({
      status: 'error',
      requestId: 'bo-business-handle-phone',
      message: { title: 'Os argumentos para esta função não são válidos.' },
    });
  };
  const handleBusinessPhoneOrdering = (newPhones: BusinessPhone[]) => {
    return dispatch({ type: 'ordering_business_phone', payload: newPhones });
  };
  // const handleManagerProfileChange = (key: string, value: any) => {
  //   dispatch({ type: 'update_manager', payload: { [key]: value } });
  // };
  const handleBankingInfoChange = (newBankAccount: Partial<BankAccount>) => {
    dispatch({ type: 'update_banking', payload: newBankAccount });
  };
  const handleSave = () => {
    if (state.businessProfile.situation === 'approved') {
      const validation = getValidationStatus(
        contextValidation,
        dispatchAppRequestResult
      );
      if (!validation) return;
    }
    let businessChanges = null;
    let managerChanges = null;
    let bankingChanges = null;
    if (!isEqual(state.businessProfile, business))
      businessChanges = pick(state.businessProfile, businessKeys);
    // if (!isEqual(state.manager, manager)) managerChanges = state.manager;
    if (
      !bankingInfoIsEmpty(state.bankingInfo) &&
      !isEqual(state.bankingInfo, bankAccount)
    )
      bankingChanges = state.bankingInfo;
    updateBusinessManagerAndBankAccount({
      businessChanges,
      managerChanges,
      bankingChanges,
    });
  };
  // side effects
  React.useEffect(() => {
    clearBusiness();
  }, [clearBusiness]);
  React.useEffect(() => {
    if (businessId) setBusinessId(businessId);
  }, [businessId, setBusinessId]);
  React.useEffect(() => {
    if (business && business?.managers) {
      setManagerEmail(business?.managers[0] ?? null);
    } else setManagerEmail(null);
  }, [business, setManagerEmail]);
  // React.useEffect(() => {
  //   if (manager) dispatch({ type: 'load_manager', payload: manager });
  // }, [manager]);
  React.useEffect(() => {
    if (bankAccount && bankAccountSet(bankAccount))
      dispatch({ type: 'update_banking', payload: bankAccount });
  }, [bankAccount]);
  React.useEffect(() => {
    if (business) dispatch({ type: 'load_business', payload: business });
  }, [business]);
  // React.useEffect(() => {
  //   if (state?.manager?.phone)
  //     setContextValidation((prev) => ({ ...prev, phone: state.manager.phone?.length === 11 }));
  //   if (state?.manager?.cpf)
  //     setContextValidation((prev) => ({ ...prev, cpf: cpfutils.isValid(state.manager.cpf!) }));
  // }, [state?.manager?.phone, state?.manager?.cpf]);
  React.useEffect(() => {
    if (state?.businessProfile?.cnpj) {
      setContextValidation((prev) => ({
        ...prev,
        cnpj: cnpjutils.isValid(state.businessProfile.cnpj!),
      }));
    }
  }, [state?.businessProfile?.cnpj]);
  React.useEffect(() => {
    if (state?.businessProfile) {
      const { name, companyName, description, cuisine } =
        state?.businessProfile;
      if (!name || !companyName || !description || !cuisine) {
        setContextValidation((prev) => ({
          ...prev,
          profile: false,
        }));
      } else {
        setContextValidation((prev) => ({
          ...prev,
          profile: true,
        }));
      }
    }
  }, [state?.businessProfile]);
  React.useEffect(() => {
    if (state?.businessProfile?.businessAddress?.cep) {
      setContextValidation((prev) => ({
        ...prev,
        cep: state.businessProfile.businessAddress?.cep!.length === 8,
      }));
    }
  }, [state?.businessProfile?.businessAddress?.cep]);
  React.useEffect(() => {
    if (state?.businessProfile?.businessAddress) {
      const {
        state: uf,
        city,
        neighborhood,
        address,
        number,
      } = state.businessProfile.businessAddress;
      if (!uf || !city || !neighborhood || !address || !number) {
        setContextValidation((prev) => ({
          ...prev,
          address: false,
        }));
      } else {
        setContextValidation((prev) => ({
          ...prev,
          address: true,
        }));
      }
    }
  }, [state?.businessProfile?.businessAddress]);
  React.useEffect(() => {
    if (typeof state?.businessProfile?.deliveryRange === 'number') {
      setContextValidation((prev) => ({
        ...prev,
        deliveryRange: state.businessProfile.deliveryRange! >= 1000,
      }));
    }
  }, [state?.businessProfile?.deliveryRange]);
  // UI
  return (
    <BusinessBOContext.Provider
      value={{
        manager,
        bankAccount: state.bankingInfo,
        business: state.businessProfile,
        contextValidation,
        isLoading: updateResult.isLoading,
        handleBusinessProfileChange,
        handleBusinessAddressChange,
        handleBussinesPhonesChange,
        handleBusinessPhoneOrdering,
        // handleManagerProfileChange,
        handleBankingInfoChange,
        setContextValidation,
        handleSave,
        marketPlace,
        deleteMarketPlace,
        deleteMarketPlaceResult,
        businessManagers,
        // setIsGetManagersActive,
        fetchManagers,
      }}
    >
      {children}
    </BusinessBOContext.Provider>
  );
};

export const useContextBusinessBackoffice = () => {
  return React.useContext(BusinessBOContext);
};
