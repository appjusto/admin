import { Invoice, OrderLog, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

export const useObserveOrderInvoices = (
  orderId?: string,
  isActive?: boolean
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('invoices');
  const businessId = useContextBusinessId();
  // state
  const [invoices, setInvoices] = React.useState<WithId<Invoice>[] | null>();
  const [logs, setLogs] = React.useState<WithId<OrderLog>[]>();
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!orderId) return;
    if (!isActive) return;
    const unsub1 = api.invoices().observeOrderInvoices(orderId, setInvoices);
    const unsub2 = api.order().observeOrderLogs(orderId, 'payment', setLogs);
    return () => {
      unsub1();
      unsub2();
    };
  }, [api, userCanRead, businessId, orderId, isActive]);
  // return
  return { invoices, logs };
};
