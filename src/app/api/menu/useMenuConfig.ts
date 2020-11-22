import { MenuConfig } from 'appjusto-types';
import React from 'react';
import { useApi } from '../context';

export const useMenuConfig = () => {
  const api = useApi()!;
  const [menuConfig, setMenuConfig] = React.useState<MenuConfig>({
    categoriesOrder: [],
    productsOrderByCategoryId: {},
  });
  React.useEffect(() => {
    return api.menu().observeMenuConfig('default', setMenuConfig);
  }, [api]);
  return { menuConfig, setMenuConfig };
};
