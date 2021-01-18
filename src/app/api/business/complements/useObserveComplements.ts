import { WithId } from 'appjusto-types';
import { Complement, ComplementGroup } from 'appjusto-types/menu';
import React from 'react';
import { useContextApi } from '../../../state/api/context';

export const useObserveComplements = (businessId: string | undefined, enabled: boolean) => {
  // context
  const api = useContextApi();

  // state
  const [groups, setGroups] = React.useState<WithId<ComplementGroup>[]>([]);
  const [complements, setComplements] = React.useState<WithId<Complement>[]>([]);

  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    if (!enabled) return;
    return api.business().observeComplementsGroups(businessId, setGroups);
  }, [api, businessId, enabled]);
  React.useEffect(() => {
    if (!businessId) return;
    if (!enabled) return;
    return api.business().observeComplements(businessId, setComplements);
  }, [api, businessId, enabled]);

  // return
  return { groups, complements };
};
