import { useContextApi } from 'app/state/api/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useGetOutsourceDelivery = (orderId?: string) => {
  // context
  const api = useContextApi();
  // status
  //const [deliveryAccountType, setDeliveryAccountType] = React.useState<AccountType>();
  // mutations
  const {
    mutateAsync: getOutsourceDelivery,
    mutationResult: outsourceDeliveryResult,
  } = useCustomMutation(async () => (orderId ? api.order().getOutsourceDelivery(orderId) : null));
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
