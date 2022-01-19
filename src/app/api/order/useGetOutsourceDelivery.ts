import { useContextApi } from 'app/state/api/context';
import { OutsourceAccountType, Order } from 'appjusto-types';
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
  } = useCustomMutation(
    async (accountType: OutsourceAccountType) =>
      orderId ? api.order().getOutsourceDelivery(orderId, accountType) : null,
    'getOutsourceDelivery'
  );
  const {
    mutateAsync: updateOutsourcingCourierName,
    mutationResult: updateOutsourcingCourierNameResult,
  } = useCustomMutation(async (name: string) => {
    if (!orderId) return null;
    const partialOrder = {
      courier: {
        name,
      },
    } as Partial<Order>;
    return api.order().updateOrder(orderId, partialOrder);
  }, 'getOutsourceDelivery');
  // side effets
  /*React.useEffect(() => {
    if (!orderId) return;
    return api.order().observeOrderInvoices(orderId, (invoices: WithId<Invoice>[]) => {
      const delivery = invoices.find((invoice) => invoice.invoiceType === 'delivery');
      if (delivery) setDeliveryAccountType(delivery.accountType);
    });
  }, [api, orderId]);*/
  // return
  return {
    getOutsourceDelivery,
    outsourceDeliveryResult,
    updateOutsourcingCourierName,
    updateOutsourcingCourierNameResult,
  };
};
