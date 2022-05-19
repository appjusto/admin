import { WithId } from '@appjusto/types';
import { isEqual } from 'lodash';

export const shouldUpdateState = <T extends object>(
  contextData: Partial<WithId<T>> | undefined | null,
  newData: WithId<T> | undefined | null,
  fields: (keyof T)[],
  updateToNull: boolean = true
) => {
  //
  if (!contextData) return true;
  if (newData === null) {
    if (updateToNull) return true;
    else return false;
  }
  if (newData === undefined) return false;
  return fields.some((field) => !isEqual(contextData[field], newData[field]));
};
