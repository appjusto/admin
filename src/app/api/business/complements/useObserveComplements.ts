import { WithId } from 'appjusto-types';
import { Complement, ComplementGroup } from 'appjusto-types';
import React from 'react';
import { useContextApi } from '../../../state/api/context';

export const useObserveComplements = (isMenuActive: boolean, businessId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [complementsGroups, setComplementsGroups] = React.useState<WithId<ComplementGroup>[]>([]);
  const [complements, setComplements] = React.useState<WithId<Complement>[]>([]);
  // side effects
  React.useEffect(() => {
    if (!isMenuActive) return;
    if (!businessId) return;
    const unsub = api.business().observeComplementsGroups(businessId, setComplementsGroups);
    return () => unsub();
  }, [api, isMenuActive, businessId]);
  React.useEffect(() => {
    if (!isMenuActive) return;
    if (!businessId) return;
    const unsub = api.business().observeComplements(businessId, setComplements);
    return () => unsub();
  }, [api, isMenuActive, businessId]);
  // result
  return { complementsGroups, complements };
};
