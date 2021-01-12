import * as menu from 'app/api/business/menu/functions';
import { useContextApi } from 'app/state/api/context';
import { MenuConfig } from 'appjusto-types';
import { isEmpty } from 'lodash';
import React from 'react';

export const useObserveMenuConfig = (businessId: string | undefined) => {
  const api = useContextApi();
  console.log(businessId);
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
