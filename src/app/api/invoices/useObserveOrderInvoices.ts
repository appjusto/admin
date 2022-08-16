import { Invoice, OrderLog, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusinessId } from 'app/state/business/context';
import React from 'react';

export const useObserveOrderInvoices = (
  orderId?: string,
  isActive?: boolean
) => {
  // context
  const api = useContextApi();
  const { isBackofficeUser } = useContextFirebaseUser();
  const businessId = useContextBusinessId();
  // state
  const [invoices, setInvoices] = React.useState<WithId<Invoice>[] | null>();
  const [logs, setLogs] = React.useState<WithId<OrderLog>[]>();
  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    if (!isActive) return;
    if (isBackofficeUser) {
      const unsub1 = api.invoices().observeOrderInvoices(orderId, setInvoices);
      const unsub2 = api.order().observeOrderLogs(orderId, 'payment', setLogs);
      return () => {
        unsub1();
        unsub2();
      };
    } else if (businessId) {
      const unsub = api
        .invoices()
        .observeOrderInvoices(orderId, setInvoices, businessId);
      return () => unsub();
    }
  }, [api, isBackofficeUser, businessId, orderId, isActive]);
  // return
  return { invoices, logs };
};
