import * as menu from '@appjusto/menu';
import { Ordering } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { isEmpty } from 'lodash';
import React from 'react';

export const useObserveMenuOrdering = (isMenuActive: boolean, businessId?: string) => {
  const api = useContextApi();
  //state
  const [productsOrdering, setProductsOrdering] = React.useState<Ordering>(menu.empty());
  const [complementsOrdering, setComplementsOrdering] = React.useState<Ordering>(menu.empty());
  const updateProductsOrdering = (ordering: Ordering) => {
    setProductsOrdering(ordering); // optimistic update to avoid flickering
    api.business().updateMenuOrdering(businessId!, ordering);
  };
  const updateComplementsOrdering = (ordering: Ordering) => {
    setComplementsOrdering(ordering); // optimistic update to avoid flickering
    api.business().updateMenuOrdering(businessId!, ordering, 'complements');
  };
  // side effects
  React.useEffect(() => {
    if (!isMenuActive) return;
    if (!businessId) return;
    const unsub = api.business().observeMenuOrdering(businessId, (config) => {
      setProductsOrdering(!isEmpty(config) ? config : menu.empty());
    });
    const unsub2 = api.business().observeMenuOrdering(
      businessId,
      (config) => {
        setComplementsOrdering(!isEmpty(config) ? config : menu.empty());
      },
      'complements'
    );
    return () => {
      unsub();
      unsub2();
    };
  }, [api, isMenuActive, businessId]);
  // result
  return {
    productsOrdering,
    updateProductsOrdering,
    complementsOrdering,
    updateComplementsOrdering,
  };
};
