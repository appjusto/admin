import { useContextBusiness } from 'app/state/business/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import { useObserveProducts } from '../products/useObserveProducts';
import { useBusinessBankAccount } from './useBusinessBankAccount';
import React from 'react';

const initialState = {
  managerProfile: false,
  businessProfile: false,
  businessAddress: false,
  businessMenu: false,
  businessSchedules: false,
};

export const useBusinessProfileValidation = (businessId?: string) => {
  // context
  const { business, setBusinessId } = useContextBusiness();
  const { manager, setManagerEmail } = useContextManagerProfile();
  const products = useObserveProducts(business?.id);
  const { bankAccount } = useBusinessBankAccount();

  // state
  const [businessProfileValidation, setBusinessProfileValidation] = React.useState(initialState);

  // side effects
  React.useEffect(() => {
    if (businessId) setBusinessId(businessId);
  }, [businessId, setBusinessId]);

  React.useEffect(() => {
    if (business?.managers) setManagerEmail(business.managers[0]);
  }, [business, setManagerEmail]);

  React.useEffect(() => {
    if (business) {
      const isManagerInfosOk = manager?.phone && manager.cpf ? true : false;
      const isBankingInfosOk =
        bankAccount?.type && bankAccount?.name && bankAccount?.account && bankAccount.agency
          ? true
          : false;
      const isBusinessInfosOk =
        business?.name && business?.description && business?.cnpj && business.phone ? true : false;
      const isAddressInfosOk =
        business?.businessAddress?.address &&
        business?.businessAddress?.cep &&
        business?.businessAddress?.city &&
        business?.businessAddress?.state
          ? true
          : false;
      const isSchedulesOk = business?.schedules ? true : false;
      const isMenuOk = products?.length > 0;
      setBusinessProfileValidation({
        managerProfile: isManagerInfosOk && isBankingInfosOk,
        businessProfile: isBusinessInfosOk,
        businessAddress: isAddressInfosOk,
        businessMenu: isMenuOk,
        businessSchedules: isSchedulesOk,
      });
    }
  }, [business, manager, bankAccount, products]);
  // result
  return businessProfileValidation;
};
