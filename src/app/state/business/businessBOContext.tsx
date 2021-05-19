import * as cpfutils from '@fnando/cpf';
import { useBusinessBankAccount } from 'app/api/business/profile/useBusinessBankAccount';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useUpdateManagerProfile } from 'app/api/manager/useUpdateManagerProfile';
import { BankAccount, Business, ManagerProfile, WithId } from 'appjusto-types';
import { isEmpty } from 'lodash';
import React, { Dispatch, SetStateAction } from 'react';
import { useParams } from 'react-router';
import { useContextManagerProfile } from '../manager/context';
import { businessBOReducer, businessBOState } from './businessBOReducer';
import { useContextBusiness } from './context';

const bankAccountSet = (bankAccount: BankAccount): boolean => {
  return (
    !isEmpty(bankAccount.name) && !isEmpty(bankAccount.agency) && !isEmpty(bankAccount.account)
  );
};

type Validation = { cpf: boolean };

interface BusinessBOContextProps {
  manager?: WithId<ManagerProfile> | null;
  bankAccount?: WithId<BankAccount> | null;
  business?: WithId<Business> | null;
  contextValidation: Validation;
  handleBusinessStatusChange(key: string, value: any): void;
  handleManagerProfileChange(key: string, value: any): void;
  handleBankingInfoChange(key: string, value: any): void;
  setContextValidation: Dispatch<SetStateAction<Validation>>;
  handleSave(): void;
}

const BusinessBOContext = React.createContext<BusinessBOContextProps>({} as BusinessBOContextProps);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

type Params = {
  businessId: string;
};

export const BusinessBOProvider = ({ children }: Props) => {
  // context
  const { businessId } = useParams<Params>();
  const { setBusinessId, business } = useContextBusiness();
  const { manager, setManagerEmail } = useContextManagerProfile();
  const {
    bankAccount,
    updateBankAccount,
    updateResult: BankAccountResult,
  } = useBusinessBankAccount();
  const { updateBusinessProfile, updateResult: BusinessProfileResult } = useBusinessProfile();
  const { updateProfile, updateResult: ManagerProfileResult } = useUpdateManagerProfile();

  // state
  const [state, dispatch] = React.useReducer(businessBOReducer, {} as businessBOState);
  const [contextValidation, setContextValidation] = React.useState({
    cpf: true,
  });

  // handlers
  const handleBusinessStatusChange = (key: string, value: any) => {
    dispatch({ type: 'update_business', payload: { [key]: value } });
  };

  const handleManagerProfileChange = (key: string, value: any) => {
    dispatch({ type: 'update_manager', payload: { [key]: value } });
  };

  const handleBankingInfoChange = (key: string, value: any) => {
    dispatch({ type: 'update_banking', payload: { [key]: value } });
  };

  const handleSave = () => {
    if (state.manager !== manager) updateProfile(state.manager);
    if (state.bankingInfo !== bankAccount) updateBankAccount(state.bankingInfo);
    if (state.businessProfile !== business) updateBusinessProfile(state.businessProfile);
  };

  // side effects
  React.useEffect(() => {
    if (businessId) setBusinessId(businessId);
  }, [businessId]);

  React.useEffect(() => {
    if (business && business?.managers) {
      setManagerEmail(business?.managers[0] ?? null);
    } else setManagerEmail(null);
  }, [business, setManagerEmail]);

  React.useEffect(() => {
    if (manager) dispatch({ type: 'update_manager', payload: manager });
  }, [manager]);

  React.useEffect(() => {
    if (bankAccount && bankAccountSet(bankAccount))
      dispatch({ type: 'update_banking', payload: bankAccount });
  }, [bankAccount]);

  React.useEffect(() => {
    if (business) dispatch({ type: 'update_business', payload: business });
  }, [business]);

  React.useEffect(() => {
    setContextValidation(() => {
      return {
        cpf: cpfutils.isValid(manager?.cpf!),
      };
    });
  }, [manager?.cpf]);

  // UI
  return (
    <BusinessBOContext.Provider
      value={{
        manager: state.manager,
        bankAccount: state.bankingInfo,
        business: state.businessProfile,
        contextValidation,
        handleBusinessStatusChange,
        handleManagerProfileChange,
        handleBankingInfoChange,
        setContextValidation,
        handleSave,
      }}
    >
      {children}
    </BusinessBOContext.Provider>
  );
};

export const useContextBusinessBackoffice = () => {
  return React.useContext(BusinessBOContext);
};
