import * as cpfutils from '@fnando/cpf';
import { useBusinessBankAccount } from 'app/api/business/profile/useBusinessBankAccount';
import { BankAccount, Business, ManagerProfile, WithId } from 'appjusto-types';
import React, { Dispatch, SetStateAction } from 'react';
import { useParams } from 'react-router';
import { useContextManagerProfile } from '../manager/context';
import { businessBOReducer, businessBOState } from './businessBOReducer';
import { useContextBusiness } from './context';

type Validation = { cpf: boolean };

interface BusinessBOContextProps {
  manager?: WithId<ManagerProfile> | null;
  bankingInfo?: WithId<BankAccount> | null;
  businessProfile?: WithId<Business> | null;
  contextValidation: Validation;
  handleBusinessStatusChange(key: string, value: any): void;
  handleManagerProfileChange(key: string, value: any): void;
  handleBankingInfoChange(key: string, value: any): void;
  setContextValidation: Dispatch<SetStateAction<Validation>>;
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
  const { bankAccount } = useBusinessBankAccount();

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
    if (business) dispatch({ type: 'update_business', payload: business });
    if (manager) dispatch({ type: 'update_manager', payload: manager });
    if (bankAccount) dispatch({ type: 'update_banking', payload: bankAccount });
  }, [business, manager, bankAccount]);

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
        bankingInfo: state.bankingInfo,
        businessProfile: state.businessProfile,
        contextValidation,
        handleBusinessStatusChange,
        handleManagerProfileChange,
        handleBankingInfoChange,
        setContextValidation,
      }}
    >
      {children}
    </BusinessBOContext.Provider>
  );
};

export const useContextConsumerProfile = () => {
  return React.useContext(BusinessBOContext);
};
