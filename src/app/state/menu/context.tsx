import { useObserveCategories } from 'app/api/business/categories/useObserveCategories';
import { useObserveComplements2 } from 'app/api/business/complements/useObserveComplements2';
import * as menu from 'app/api/business/menu/functions';
import { useObserveMenuOrdering } from 'app/api/business/menu/useObserveMenuOrdering';
import { useObserveProducts } from 'app/api/business/products/useObserveProducts';
import { Category, Complement, ComplementGroup, Ordering, WithId } from 'appjusto-types';
import React from 'react';
import { useContextBusinessId } from '../business/context';

interface ContextProps {
  categories: WithId<Category>[];
  ordering: Ordering;
  complementsGroupsWithItems: WithId<ComplementGroup>[];
  complements: WithId<Complement>[];
  updateMenuOrdering: (ordering: Ordering) => void;
}

interface ProviderProps {
  children: React.ReactNode | React.ReactNode[];
}
const MenuProviderContext = React.createContext<ContextProps>({} as ContextProps);

export const MenuProvider = (props: ProviderProps) => {
  // context
  const businessId = useContextBusinessId();
  const unorderedCategories = useObserveCategories(businessId);
  const products = useObserveProducts(businessId);
  const { ordering, updateMenuOrdering } = useObserveMenuOrdering(businessId);
  const categories = menu.getSorted(unorderedCategories, products, ordering);
  const { complementsGroupsWithItems, complements } = useObserveComplements2(businessId!);
  // provider
  return (
    <MenuProviderContext.Provider
      value={{
        categories,
        ordering,
        complementsGroupsWithItems,
        complements,
        updateMenuOrdering,
      }}
      {...props}
    />
  );
};

export const useContextMenu = () => {
  return React.useContext(MenuProviderContext)!;
};
