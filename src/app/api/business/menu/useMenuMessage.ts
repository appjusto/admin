import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import { BusinessMenuMessage } from '@appjusto/types';
import React from 'react';
import { useCustomMutation } from 'app/api/mutation/useCustomMutation';

export const useMenuMessage = () => {
  // context
  const api = useContextApi();
  const businessId = useContextBusinessId();
  // state
  const [menuMessage, setMenuMessage] = React.useState<BusinessMenuMessage>();
  // mutations
  const {
    mutateAsync: updateMenuMessage,
    mutationResult: updateMenuMessageResult,
  } = useCustomMutation(
    async (message: BusinessMenuMessage) => api.business().addMenuMessage(businessId!, message),
    'updateMenuMessage'
  );
  const {
    mutateAsync: deleteMenuMessage,
    mutationResult: deleteMenuMessageResult,
  } = useCustomMutation(
    async () => api.business().deleteMenuMessage(businessId!),
    'deleteMenuMessage'
  );
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    (async () => {
      const message = await api.business().fetchMenuMessage(businessId);
      if (message) setMenuMessage(message);
    })();
  }, [api, businessId]);
  // result
  return {
    menuMessage,
    updateMenuMessage,
    updateMenuMessageResult,
    deleteMenuMessage,
    deleteMenuMessageResult,
  };
};
