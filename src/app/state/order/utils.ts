import { Order } from '@appjusto/types';
import { isElectron } from '@firebase/util';

const isDesktopApp = isElectron();

export const getOrderAcceptedFrom = (
  isBackofficeUser?: boolean | null
): Order['acceptedFrom'] => {
  if (isBackofficeUser) return 'backoffice';
  if (isDesktopApp) return 'admin-desktop';
  return 'admin-web';
};
