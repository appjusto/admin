import { BankAccount, Business, WithId } from '@appjusto/types';
import { BackofficeProfileValidation } from 'common/types';
import { isEqual } from 'lodash';
import { AppDispatch } from '../requests/context';

type K = keyof WithId<Business>;

export const getBusinessChangedKeys = (
  prevState: WithId<Business>,
  nextState: WithId<Business>
): K[] => {
  let changedKeys = [] as K[];
  const keys = [
    // primitive types
    'name',
    'companyName',
    'cnpj',
    'phone',
    'phones',
    'status',
    'situation',
    'enabled',
    'profileIssuesMessage',
    'cuisine',
    'description',
    'minimumOrder',
    'averageCookingTime',
    'orderAcceptanceTime',
    'deliveryRange',
    'onboarding',
    'logoExists',
    'coverImageExists',
    'orderPrinting',
    'slug',
    'settings',
    // object types
    'managers',
    'profileIssues',
    'businessAddress',
    'schedules',
  ] as K[];
  keys.forEach((key) => !isEqual(prevState[key], nextState[key]) && changedKeys.push(key));
  return changedKeys;
};

export const bankingInfoIsEmpty = (bankingInfo?: BankAccount) => {
  if (!bankingInfo) return true;
  else return bankingInfo.account === '' && bankingInfo.agency === '';
};

export const getValidationStatus = (
  validation: BackofficeProfileValidation,
  dispatch: AppDispatch
) => {
  const { cnpj, profile, cep, address, deliveryRange, agency, account } = validation;
  if (!cnpj) {
    dispatch({
      status: 'error',
      requestId: 'bo-business-context-valid-cnpj',
      message: { title: 'O CNPJ informado não é válido' },
    });
    return false;
  }
  if (!profile) {
    dispatch({
      status: 'error',
      requestId: 'bo-business-context-valid-cnpj',
      message: { title: 'Um ou mais campos do perfil não foram informados' },
    });
    return false;
  }
  if (!cep) {
    dispatch({
      status: 'error',
      requestId: 'bo-business-context-valid-cep',
      message: { title: 'O CEP informado não é válido' },
    });
    return false;
  }
  if (!address) {
    dispatch({
      status: 'error',
      requestId: 'bo-business-context-valid-address',
      message: { title: 'Um ou mais campos do endereço não foram informados' },
    });
    return false;
  }
  if (!deliveryRange) {
    dispatch({
      status: 'error',
      requestId: 'bo-business-context-valid-range',
      message: { title: 'O raio de entrega informado não é válido' },
    });
    return false;
  }
  if (!agency) {
    dispatch({
      status: 'error',
      requestId: 'bo-business-context-valid-agency',
      message: { title: 'A agência informada não é válida' },
    });
    return false;
  }
  if (!account) {
    dispatch({
      status: 'error',
      requestId: 'bo-business-context-valid-account',
      message: { title: 'A conta informada não é válida' },
    });
    return false;
  }
  return true;
};
