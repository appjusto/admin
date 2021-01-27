import { WithId } from 'appjusto-types';
import { Complement, ComplementGroup } from 'appjusto-types/menu';
import React from 'react';
import { useContextApi } from '../../../state/api/context';

export const useObserveComplements = (
  businessId: string | undefined,
  productId: string,
  enabled: boolean
) => {
  // context
  const api = useContextApi();

  // state
  const [groups, setGroups] = React.useState<WithId<ComplementGroup>[]>([]);
  const [complements, setComplements] = React.useState<WithId<Complement>[]>([]);

  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    //if (!enabled) return;
    return api.business().observeComplementsGroups(businessId, productId, setGroups);
  }, [api, businessId, productId, enabled]);
  React.useEffect(() => {
    if (!businessId) return;
    //if (!enabled) return;
    return api.business().observeComplements(businessId, productId, setComplements);
  }, [api, businessId, productId, enabled]);

  // return
  return { groups, complements };
};
