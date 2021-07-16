import { useContextApi } from 'app/state/api/context';
import { useMutation } from 'react-query';
//import React from 'react';
//import { AccountType, Invoice, WithId } from 'appjusto-types';

export const useGetOutsourceDelivery = (orderId?: string) => {
  // context
  const api = useContextApi();
  // status
  //const [deliveryAccountType, setDeliveryAccountType] = React.useState<AccountType>();
  // mutations
  const [getOutsourceDelivery, outsourceDeliveryResult] = useMutation(async () =>
    orderId ? api.order().getOutsourceDelivery(orderId) : null
  );
  // side effets
  /*React.useEffect(() => {
    if (!orderId) return;
    return api.order().observeOrderInvoices(orderId, (invoices: WithId<Invoice>[]) => {
      const delivery = invoices.find((invoice) => invoice.invoiceType === 'delivery');
      if (delivery) setDeliveryAccountType(delivery.accountType);
    });
  }, [api, orderId]);*/
  // return
  return { getOutsourceDelivery, outsourceDeliveryResult };
};
