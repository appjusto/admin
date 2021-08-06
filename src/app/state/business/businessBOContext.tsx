import * as cpfutils from '@fnando/cpf';
import { useBusinessBankAccount } from 'app/api/business/profile/useBusinessBankAccount';
import { useBusinessManagerAndBankAccountBatch } from 'app/api/business/profile/useBusinessManagerAndBankAccountBatch';
import { useBusinessMarketPlace } from 'app/api/business/useBusinessMarketPlace';
import {
  BankAccount,
  Business,
  ManagerProfile,
  MarketplaceAccountInfo,
  WithId,
} from 'appjusto-types';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import { isEmpty, isEqual } from 'lodash';
import React, { Dispatch, SetStateAction } from 'react';
import { MutateFunction, MutationResult } from 'react-query';
import { useParams } from 'react-router';
import { useContextManagerProfile } from '../manager/context';
import { businessBOReducer, businessBOState } from './businessBOReducer';
import { useContextBusiness } from './context';

const bankAccountSet = (bankAccount: BankAccount): boolean => {
  return (
    !isEmpty(bankAccount.name) && !isEmpty(bankAccount.agency) && !isEmpty(bankAccount.account)
  );
};

type Validation = {
  cpf: boolean;
  phone: boolean;
  agency: boolean;
  account: boolean;
};

interface BusinessBOContextProps {
  manager?: WithId<ManagerProfile> | null;
  bankAccount?: WithId<BankAccount> | null;
  business?: WithId<Business> | null;
  contextValidation: Validation;
  isLoading: boolean;
  handleBusinessStatusChange(key: string, value: any): void;
  handleManagerProfileChange(key: string, value: any): void;
  handleBankingInfoChange(key: string, value: any): void;
  setContextValidation: Dispatch<SetStateAction<Validation>>;
  handleSave(): void;
  marketPlace?: MarketplaceAccountInfo | null;
  deleteMarketPlace: MutateFunction<void, unknown, undefined, unknown>;
  deleteMarketPlaceResult: MutationResult<void, unknown>;
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
  const { marketPlace, deleteMarketPlace, deleteMarketPlaceResult } = useBusinessMarketPlace(
    businessId
  );

  const {
    updateBusinessManagerAndBankAccount,
    updateResult,
  } = useBusinessManagerAndBankAccountBatch();
  const { isLoading, isSuccess, isError, error: updateError } = updateResult;
  // state
  const [state, dispatch] = React.useReducer(businessBOReducer, {} as businessBOState);
  //const [isLoading, setIsLoading] = React.useState(false);
  //const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState(initialError);
  const [contextValidation, setContextValidation] = React.useState({
    cpf: true,
    phone: true,
    agency: true,
    account: true,
  });

  // refs
  const submission = React.useRef(0);

  // handlers
  const handleBusinessStatusChange = React.useCallback((key: string, value: any) => {
    if (key === 'situation' && value === 'blocked') {
      dispatch({
        type: 'update_business',
        payload: { situation: 'blocked', enabled: false, status: 'closed' },
      });
    } else dispatch({ type: 'update_business', payload: { [key]: value } });
  }, []);

  const handleManagerProfileChange = (key: string, value: any) => {
    dispatch({ type: 'update_manager', payload: { [key]: value } });
  };

  const handleBankingInfoChange = (key: string, value: any) => {
    dispatch({ type: 'update_banking', payload: { [key]: value } });
  };

  const handleSave = () => {
    submission.current += 1;
    setError(initialError);
    if (business?.situation === 'approved') {
      const { cpf, phone, agency, account } = contextValidation;
      if (!cpf)
        return setError({
          status: true,
          error: null,
          message: { title: 'O CPF informado não é válido' },
        });
      if (!phone)
        return setError({
          status: true,
          error: null,
          message: { title: 'O cecular informado não é válido' },
        });
      if (!agency)
        return setError({
          status: true,
          error: null,
          message: { title: 'A agência informada não é válida' },
        });
      if (!account)
        return setError({
          status: true,
          error: null,
          message: { title: 'A agência informada não é válida' },
        });
    }
    let businessChanges = null;
    let managerChanges = null;
    let bankingChanges = null;
    if (!isEqual(state.businessProfile, business)) businessChanges = state.businessProfile;
    if (!isEqual(state.manager, manager)) managerChanges = state.manager;
    if (!isEmpty(state.bankingInfo) && !isEqual(state.bankingInfo, bankAccount))
      bankingChanges = state.bankingInfo;
    updateBusinessManagerAndBankAccount({ businessChanges, managerChanges, bankingChanges });
  };

  // side effects
  React.useEffect(() => {
    if (businessId) setBusinessId(businessId);
  }, [businessId, setBusinessId]);

  React.useEffect(() => {
    if (business && business?.managers) {
      setManagerEmail(business?.managers[0] ?? null);
    } else setManagerEmail(null);
  }, [business, setManagerEmail]);

  React.useEffect(() => {
    if (manager) dispatch({ type: 'load_manager', payload: manager });
    else dispatch({ type: 'clear_manager' });
  }, [manager]);

  React.useEffect(() => {
    if (bankAccount && bankAccountSet(bankAccount))
      dispatch({ type: 'load_banking', payload: bankAccount });
    else dispatch({ type: 'clear_banking' });
  }, [bankAccount]);

  React.useEffect(() => {
    if (business) dispatch({ type: 'load_business', payload: business });
    else dispatch({ type: 'clear_business' });
  }, [business]);

  React.useEffect(() => {
    if (state?.manager?.phone)
      setContextValidation((prev) => ({ ...prev, phone: state.manager.phone?.length === 11 }));
    if (state?.manager?.cpf)
      setContextValidation((prev) => ({ ...prev, cpf: cpfutils.isValid(state.manager.cpf!) }));
  }, [state?.manager?.phone, state?.manager?.cpf]);

  React.useEffect(() => {
    if (isError) {
      setError({
        status: true,
        error: updateError,
        message: { title: 'Não foi possível acessar o servidor.' },
      });
    } else {
      setError({
        status: false,
        error: null,
      });
    }
  }, [isError, updateError]);

  // UI
  return (
    <BusinessBOContext.Provider
      value={{
        manager: state.manager,
        bankAccount: state.bankingInfo,
        business: state.businessProfile,
        contextValidation,
        isLoading,
        handleBusinessStatusChange,
        handleManagerProfileChange,
        handleBankingInfoChange,
        setContextValidation,
        handleSave,
        marketPlace,
        deleteMarketPlace,
        deleteMarketPlaceResult,
      }}
    >
      {children}
      <SuccessAndErrorHandler
        submission={submission.current}
        isSuccess={isSuccess}
        isError={error.status}
        error={error.error}
        errorMessage={error.message}
      />
    </BusinessBOContext.Provider>
  );
};

export const useContextBusinessBackoffice = () => {
  return React.useContext(BusinessBOContext);
};
