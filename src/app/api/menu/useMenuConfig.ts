import { useBusinessId } from 'app/state/business/context';
import { MenuConfig } from 'appjusto-types';
import React from 'react';
import { useApi } from '../context';

export const useMenuConfig = () => {
  const api = useApi()!;
  const businessId = useBusinessId()!;
  const [menuConfig, setMenuConfig] = React.useState<MenuConfig>({
    categoriesOrder: [],
    productsOrderByCategoryId: {},
  });
  React.useEffect(() => {
    return api.menu().observeMenuConfig(businessId, setMenuConfig);
  }, [api, businessId]);
  return { menuConfig, setMenuConfig };
};
