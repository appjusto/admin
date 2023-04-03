import { Business, WithId } from '@appjusto/types';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextAppRequests } from 'app/state/requests/context';
import React from 'react';

export const useVisibilityToast = (business?: WithId<Business> | null) => {
  // context
  const { isBackofficeUser } = useContextFirebaseUser();
  const { dispatchAppRequestResult } = useContextAppRequests();
  // refs
  const enabledRef = React.useRef({ value: false, active: false });
  //handlers
  const handleVisibilityAlert = React.useCallback(() => {
    if (enabledRef.current.value) return;
    if (enabledRef.current.active) return;
    dispatchAppRequestResult({
      status: 'error',
      requestId: 'disabled-business-alert',
      message: {
        title: 'Seu restaurante não está visível.',
        description:
          'Seu restaurante não aparecerá para seus clientes. Para deixá-lo visível, vá até a seção de "visibilidade" no menu "operação" ou contate o administrador desta unidade.',
      },
      duration: 12000,
    });
    enabledRef.current.active = true;
  }, [enabledRef, dispatchAppRequestResult]);
  React.useEffect(() => {
    enabledRef.current.value = business?.enabled ?? false;
  }, [business?.enabled]);
  React.useEffect(() => {
    if (isBackofficeUser) return;
    if (business?.situation !== 'approved') return;
    if (business.enabled) return;
    const timer = setTimeout(() => handleVisibilityAlert(), 2000);
    return () => clearTimeout(timer);
  }, [
    isBackofficeUser,
    business?.situation,
    business?.enabled,
    handleVisibilityAlert,
  ]);
};
