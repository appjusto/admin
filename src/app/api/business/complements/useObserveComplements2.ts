import { WithId } from 'appjusto-types';
import { Complement, ComplementGroup } from 'appjusto-types';
import React from 'react';
import { useContextApi } from '../../../state/api/context';

export const useObserveComplements2 = (businessId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [complementsGroups, setComplementsGroups] = React.useState<WithId<ComplementGroup>[]>([]);
  const [complements, setComplements] = React.useState<WithId<Complement>[]>([]);
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    const unsub = api.business().observeComplementsGroups2(businessId, setComplementsGroups);
    return () => unsub();
  }, [api, businessId]);
  React.useEffect(() => {
    if (!businessId) return;
    const unsub = api.business().observeComplements2(businessId, setComplements);
    return () => unsub();
  }, [api, businessId]);
  // return
  return { complementsGroups, complements };
};
