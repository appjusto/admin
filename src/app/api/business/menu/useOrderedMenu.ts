import { useContextMenuConfig } from 'app/state/menu/config';
import { useObserveCategories } from '../categories/useObserveCategories';
import { useObserveProducts } from '../products/useObserveProducts';
import { getOrderedMenu } from './functions';

export const useOrderedMenu = (businessId: string | undefined) => {
  const categories = useObserveCategories(businessId);
  const products = useObserveProducts(businessId);
  const { menuConfig } = useContextMenuConfig();
  return getOrderedMenu(categories, products, menuConfig);
};
