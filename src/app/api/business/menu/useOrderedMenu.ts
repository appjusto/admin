import { useObserveCategories } from '../categories/useObserveCategories';
import { useMenuConfig } from '../config/useMenuConfig';
import { useObserveProducts } from '../products/useObserveProducts';
import { getOrderedMenu } from './functions';

export const useOrderedMenu = (businessId: string | undefined) => {
  const categories = useObserveCategories(businessId);
  const products = useObserveProducts(businessId);
  const { menuConfig } = useMenuConfig(businessId);
  return getOrderedMenu(categories, products, menuConfig);
};
