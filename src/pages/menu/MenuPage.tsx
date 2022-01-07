import { MenuContextProvider } from 'app/state/menu/context';
import React from 'react';
import Menu from './Menu';

const MenuPage = () => {
  // UI
  return (
    <MenuContextProvider>
      <Menu />
    </MenuContextProvider>
  );
};

export default MenuPage;
