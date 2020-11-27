import React from 'react';
import { CategoriesProvider } from './categories';
import { MenuConfigProvider } from './config';
import { ProductsProvider } from './products';

interface Props {
  children: React.ReactNode;
}

export const MenuProvider = ({ children }: Props) => (
  <MenuConfigProvider>
    <CategoriesProvider>
      <ProductsProvider>{children}</ProductsProvider>
    </CategoriesProvider>
  </MenuConfigProvider>
);
