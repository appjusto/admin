import { Business, WithId } from '@appjusto/types';
import { useContextAppRequests } from 'app/state/requests/context';
import { useContextStaffProfile } from 'app/state/staff/context';
import React from 'react';

export const useVisibilityToast = (business?: WithId<Business> | null) => {
  // context
  const { isBackofficeUser } = useContextStaffProfile();
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
        title: 'Seu restaurante não está visível no marketplace.',
        description:
          'Apenas clientes com seu link direto poderão realizar pedidos. Para deixá-lo visível, vá até a seção de "visibilidade no marketplace" no menu "operação" ou contate o administrador desta unidade.',
      },
      duration: 12000,
    });
    enabledRef.current.active = true;
  }, [enabledRef, dispatchAppRequestResult]);
  React.useEffect(() => {
    enabledRef.current.value = business?.enabled ?? false;
  }, [business?.enabled]);
  React.useEffect(() => {
    if (isBackofficeUser !== false) return;
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
