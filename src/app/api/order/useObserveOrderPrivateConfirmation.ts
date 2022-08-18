import { OrderConfirmation } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useQuery } from 'react-query';

export const useObserveOrderPrivateConfirmation = (
  orderId?: string,
  courierId?: string
) => {
  // context
  const api = useContextApi();
  // state
  const [confirmation, setConfirmation] =
    React.useState<OrderConfirmation | null>();
  // queries
  const getFrontImageURL = () => {
    if (!orderId) return;
    if (!courierId) return;
    if (confirmation?.handshakeResponse !== null) return;
    return api
      .order()
      .getOrderConfirmationPictureURL(orderId, courierId, 'front');
  };
  const { data: frontUrl } = useQuery(
    ['orderConfirmation:front', orderId, courierId, confirmation],
    getFrontImageURL
  );
  const getPackageImageURL = () => {
    if (!orderId) return;
    if (!courierId) return;
    if (confirmation?.handshakeResponse !== null) return;
    return api
      .order()
      .getOrderConfirmationPictureURL(orderId, courierId, 'package');
  };
  const { data: packageUrl } = useQuery(
    ['orderConfirmation:package', orderId, courierId, confirmation],
    getPackageImageURL
  );
  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    const unsub = api
      .order()
      .observeOrderPrivateConfirmation(orderId, setConfirmation);
    return () => unsub();
  }, [api, orderId]);
  // return
  return { confirmation, frontUrl, packageUrl };
};
