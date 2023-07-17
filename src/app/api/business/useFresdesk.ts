import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextStaffProfile } from 'app/state/staff/context';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';

export const useFreshDesk = (
  businessId?: string,
  businessName?: string,
  phone?: string
) => {
  // context
  const { user } = useContextFirebaseUser();
  const { isBackofficeUser } = useContextStaffProfile();
  const { path } = useRouteMatch();
  // handlers
  const initFreshChat = React.useCallback(() => {
    if (path.includes('/app') && isBackofficeUser === false) {
      try {
        //@ts-ignore
        if (window.fcWidget) {
          //@ts-ignore
          window.fcWidget.init({
            token: '081766df-fabc-4189-a940-4e701cd3d451',
            host: 'https://wchat.freshchat.com',
            externalId: businessId,
            firstName: businessName,
            email: user?.email,
            phone: phone,
          });
          //@ts-ignore
          window.fcWidget.setExternalId(businessId);
          //@ts-ignore
          //window.fcWidget.user.setFirstName(businessName);
          //@ts-ignore
          //window.fcWidget.user.setEmail(user?.email);
          //@ts-ignore
          //window.fcWidget.user.setPhone(phone);
          //@ts-ignore
          window.fcWidget.user.setProperties({
            firstName: businessName,
            email: user?.email,
            phone: phone,
          });
        }
      } catch (error) {
        console.log('initFreshChat error: ', error);
      }
    } else {
      try {
        //@ts-ignore
        if (window.fcWidget) {
          //@ts-ignore
          window.fcWidget.destroy();
        }
      } catch (error) {
        console.log('initFreshChat error: ', error);
      }
    }
  }, [path, isBackofficeUser, businessId, businessName, user?.email, phone]);
  // side effects
  React.useEffect(() => {
    initFreshChat();
  }, [initFreshChat]);
  return;
};
