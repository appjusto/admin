import * as menu from 'app/api/business/menu/functions';
import { useContextApi } from 'app/state/api/context';
import { Ordering } from 'appjusto-types';
import { isEmpty } from 'lodash';
import React from 'react';

export const useObserveMenuOrdering = (businessId: string | undefined) => {
  const api = useContextApi();
  //state
  const [ordering, setOrdering] = React.useState<Ordering>(menu.empty());
  const updateMenuOrdering = (ordering: Ordering) => {
    setOrdering(ordering); // optimistic update to avoid flickering
    api.business().updateMenuOrdering(businessId!, ordering);
  };
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    return api.business().observeMenuOrdering(businessId, (config) => {
      setOrdering(!isEmpty(config) ? config : menu.empty());
    });
  }, [api, businessId]);
  return { ordering, updateMenuOrdering };
};
