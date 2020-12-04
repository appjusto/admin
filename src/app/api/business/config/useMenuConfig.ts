import React from 'react';
import { useApi } from 'app/state/api/context';
import { MenuConfig } from 'appjusto-types';
import * as functions from 'app/api/business/menu/functions';
import { useMutation } from 'react-query';
import { isEmpty } from 'lodash';

export const useMenuConfig = (businessId: string | undefined) => {
  const api = useApi();

  //state
  const [menuConfig, setMenuConfig] = React.useState<MenuConfig>(functions.empty());
  const [updateMenuConfig] = useMutation(async (menuConfig: MenuConfig) => {
    setMenuConfig(menuConfig); // optimistic update
    api.business().updateMenuConfig(businessId!, menuConfig);
  });

  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    return api.business().observeMenuConfig(businessId, (config) => {
      setMenuConfig(!isEmpty(config) ? config : functions.empty());
    });
  }, [api, businessId]);

  return { menuConfig, updateMenuConfig };
};
