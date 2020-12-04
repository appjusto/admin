import { useObserveProducts } from 'app/api/business/products/useObserveProducts';
import { Product, WithId } from 'appjusto-types';
import { memoize } from 'lodash';
import React from 'react';
import { useMenuConfigValue } from './config';

const ProductsContext = React.createContext<(categoryId: string) => WithId<Product>[]>(
  (categoryId: string) => []
);

export const ProductsProvider = (props: Omit<React.ProviderProps<WithId<Product>[]>, 'value'>) => {
  // context

  const unorderedProducts = useObserveProducts();
  const { menuConfig } = useMenuConfigValue();
  const { productsOrderByCategoryId } = menuConfig;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getProductsByCategoryId = React.useCallback(
    memoize((categoryId: string) => {
      const productsOrder = productsOrderByCategoryId[categoryId];
      if (!productsOrder) return [];
      return unorderedProducts
        .filter((product) => productsOrder.indexOf(product.id) !== -1) // only in this category
        .sort((a, b) => productsOrder.indexOf(a.id) - productsOrder.indexOf(b.id));
    }),
    [unorderedProducts, productsOrderByCategoryId]
  );

  return (
    <ProductsContext.Provider value={getProductsByCategoryId}>
      {props.children}
    </ProductsContext.Provider>
  );
};

export const useGetProductsByCategoryId = () => {
  return React.useContext(ProductsContext);
};
