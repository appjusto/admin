import { Business, WithId } from 'appjusto-types';
import { isEqual } from 'lodash';

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
    // object types
    'managers',
    'profileIssues',
    'businessAddress',
    'schedules',
  ] as K[];
  keys.forEach((key) => !isEqual(prevState[key], nextState[key]) && changedKeys.push(key));
  return changedKeys;
};
