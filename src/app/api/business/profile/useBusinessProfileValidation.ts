import { useContextBusiness } from 'app/state/business/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import React from 'react';
import { getBusinessService } from 'utils/functions';
import { useObserveProducts } from '../products/useObserveProducts';
import { useBusinessBankAccount } from './useBusinessBankAccount';

const initialState = {
  managerProfile: false,
  businessProfile: false,
  bankingInformation: false,
  businessAddress: false,
  businessLogistics: false,
  businessMenu: false,
  businessSchedules: false,
};

export const useBusinessProfileValidation = (businessId?: string) => {
  // context
  const { business, changeBusinessId, businessFleet } = useContextBusiness();
  const { manager, setManagerEmail } = useContextManagerProfile();
  const products = useObserveProducts(true, business?.id);
  const { bankAccount } = useBusinessBankAccount(business?.id);
  // state
  const [businessProfileValidation, setBusinessProfileValidation] =
    React.useState(initialState);
  // side effects
  React.useEffect(() => {
    if (businessId) changeBusinessId(businessId);
  }, [businessId, changeBusinessId]);
  React.useEffect(() => {
    if (business?.managers) setManagerEmail(business.managers[0]);
  }, [business, setManagerEmail]);
  React.useEffect(() => {
    if (business) {
      const isManagerInfosOk = manager?.phone && manager.cpf ? true : false;
      const isBankingInfosOk =
        bankAccount?.type &&
        bankAccount?.name &&
        bankAccount?.account &&
        bankAccount.agency
          ? true
          : false;
      const isBusinessInfosOk =
        business?.name &&
        business?.description &&
        business?.cnpj &&
        business.phones
          ? true
          : false;
      const isAddressInfosOk =
        business?.businessAddress?.address &&
        business?.businessAddress?.cep &&
        business?.businessAddress?.city &&
        business?.businessAddress?.state
          ? true
          : false;
      const logistics = getBusinessService(business.services, 'logistics');
      const isLogisticsOk = logistics ? true : businessFleet ? true : false;
      const isSchedulesOk = business?.schedules ? true : false;
      const isMenuOk = products?.length > 0;
      setBusinessProfileValidation({
        managerProfile: isManagerInfosOk,
        businessProfile: isBusinessInfosOk,
        bankingInformation: isBankingInfosOk,
        businessAddress: isAddressInfosOk,
        businessLogistics: isLogisticsOk,
        businessMenu: isMenuOk,
        businessSchedules: isSchedulesOk,
      });
    }
  }, [business, manager, bankAccount, businessFleet, products]);
  // result
  return businessProfileValidation;
};
