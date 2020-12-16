import React from 'react';
import { useApi } from 'app/state/api/context';
import { MenuConfig } from 'appjusto-types';
import * as menu from 'app/api/business/menu/functions';
import { isEmpty } from 'lodash';

export const useObserveMenuConfig = (businessId: string | undefined) => {
  const api = useApi();

  //state
  const [menuConfig, setMenuConfig] = React.useState<MenuConfig>(menu.empty());
  const updateMenuConfig = (menuConfig: MenuConfig) => {
    setMenuConfig(menuConfig); // optimistic update to avoid flickering
    api.business().updateMenuConfig(businessId!, menuConfig);
  };

  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    return api.business().observeMenuConfig(businessId, (config) => {
      setMenuConfig(!isEmpty(config) ? config : menu.empty());
    });
  }, [api, businessId]);

  return { menuConfig, updateMenuConfig };
};
