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
  const [complementsGroupsWithItems, setComplementsGroupsWithItems] = React.useState<
    WithId<ComplementGroup>[]
  >([]);
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
  /*React.useEffect(() => {
    if (complementsGroups.length === 0 || complements.length === 0) return;
    const groupsWithItems = complementsGroups.reduce<WithId<ComplementGroup>[]>((result, group) => {
      let groupWithItems = { ...group, items: [] as WithId<Complement>[] };
      if (groupWithItems.complements) {
        groupWithItems.complements.forEach((complementId) => {
          const complement = complements.find((complement) => complement.id === complementId);
          if (complement) groupWithItems.items.push(complement);
        });
        result.push(groupWithItems);
        return result;
      }
      return [...result, group];
    }, []);
    setComplementsGroupsWithItems(groupsWithItems);
  }, [complementsGroups, complements]);*/
  // result
  return { complementsGroups, complementsGroupsWithItems, complements };
};
