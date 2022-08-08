import {
  CancelOrderPayload,
  DispatchingState,
  InvoiceType,
  Issue,
  IssueType,
  Order,
  OrderPaymentLog,
  OrderStatus,
  WithId,
} from '@appjusto/types';
import { useObserveOrderChatMessages } from 'app/api/chat/useObserveOrderChatMessages';
import { useObserveOrderInvoices } from 'app/api/order/useObserveOrderInvoices';
import { useOrder } from 'app/api/order/useOrder';
import { useFlaggedLocations } from 'app/api/platform/useFlaggedLocations';
import { useIssuesByType } from 'app/api/platform/useIssuesByTypes';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { ConsumerProvider } from 'app/state/consumer/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { useContextStaffProfile } from 'app/state/staff/context';
import { GeoPoint } from 'firebase/firestore';
import { OrderDetails } from 'pages/orders/drawers/orderdrawer/OrderDetails';
import { OrderIssuesTable } from 'pages/orders/drawers/orderdrawer/OrderIssuesTable';
import React from 'react';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import { Invoices } from './Invoices';
import { Matching } from './Matching';
import { OrderBaseDrawer } from './OrderBaseDrawer';
import { OrderChats } from './OrderChats';
import { OrderStatusBar } from './OrderStatusBar';
import { Participants } from './Participants';

export type OrderDrawerLoadingState =
  | 'idle'
  | 'preventCancel'
  | 'preventConfirm'
  | 'general';

interface ConsumerDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  orderId: string;
};

const cancelOptionsArray = ['agent-order-cancel'] as IssueType[];

export interface RefundParams {
  platform: boolean;
  products: boolean;
  delivery: boolean;
}

export const BackofficeOrderDrawer = ({
  onClose,
  ...props
}: ConsumerDrawerProps) => {
  //context
  const { isBackofficeSuperuser } = useContextFirebaseUser();
  const { staff } = useContextStaffProfile();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { path } = useRouteMatch();
  const { orderId } = useParams<Params>();
  const {
    order,
    updateOrder,
    updateResult,
    updateOrderStaff,
    updateOrderStaffResult,
    cancelOrder,
    cancelResult,
    deleteQuoteOrder,
    deleteOrderResult,
    orderIssues,
    orderCancellation,
    orderCancellationCosts,
  } = useOrder(orderId);
  const { invoices, logs } = useObserveOrderInvoices(orderId);
  const cancelOptions = useIssuesByType(cancelOptionsArray);
  const { addFlaggedLocation } = useFlaggedLocations();
  const { orderChatGroup } = useObserveOrderChatMessages(orderId);
  // state
  const [status, setStatus] = React.useState<OrderStatus | undefined>(
    order?.status
  );
  const [dispatchingState, setDispatchingState] = React.useState<
    DispatchingState | undefined | null
  >(order?.dispatchingState);
  const [issue, setIssue] = React.useState<Issue | null>();
  const [message, setMessage] = React.useState<string>();
  const [refund, setRefund] = React.useState<InvoiceType[]>([
    'platform',
    'products',
    'delivery',
  ]);
  const [loadingState, setLoadingState] =
    React.useState<OrderDrawerLoadingState>('idle');
  // helpers
  let refundValue = 0;
  if (refund.includes('platform') && order?.fare?.platform?.value)
    refundValue += order.fare.platform.value;
  if (refund.includes('products') && order?.fare?.business?.value)
    refundValue += order.fare.business.value;
  if (refund.includes('delivery') && order?.fare?.courier?.value)
    refundValue += order.fare.courier.value;
  const canUpdateOrderStaff =
    order?.staff?.id === staff?.id || isBackofficeSuperuser;
  //handlers
  const handleIssueOrder = () => {
    const oldFlags = order?.flags;
    if (oldFlags) {
      const flags = oldFlags.filter((flag) => flag !== 'issue');
      updateOrder({ flags });
    }
  };
  const handleUpdateOrderStaff = async (type: 'assume' | 'release') => {
    if (type === 'assume') {
      if (order?.staff) {
        return dispatchAppRequestResult({
          status: 'error',
          requestId: 'Operação negada',
          message: { title: 'Já existe um agente responsável pelo pedido.' },
        });
      }
      updateOrderStaff({
        id: staff?.id!,
        email: staff?.email!,
        name: staff?.name ?? null,
      });
    } else if (type === 'release') {
      if (type === 'release' && !canUpdateOrderStaff) {
        return dispatchAppRequestResult({
          status: 'error',
          requestId: 'Operação negada',
          message: { title: 'Este usuário não é o responsável pelo pedido.' },
        });
      }
      updateOrderStaff(null);
    }
  };
  const updateState = (
    type: 'status' | 'dispatchingState' | 'issue' | 'message',
    value: OrderStatus | WithId<Issue> | string
  ) => {
    if (type === 'status') setStatus(value as OrderStatus);
    else if (type === 'dispatchingState')
      setDispatchingState(value as DispatchingState);
    else if (type === 'issue')
      setIssue(cancelOptions?.find((item) => item.id === value) ?? null);
    else if (type === 'message') setMessage(value as string);
  };
  const onRefundingChange = (type: InvoiceType, value: boolean) => {
    setRefund((prev: InvoiceType[]) => {
      let newState = [...prev];
      if (value) {
        newState.push(type);
        return newState;
      } else {
        return newState.filter((item) => item !== type);
      }
    });
  };
  const cancellation = (type?: 'prevention') => {
    if (
      type === 'prevention' ||
      issue?.id === 'agent-order-cancel-fraud-prevention'
    ) {
      const preventionIssue = cancelOptions?.find(
        (issue) => issue.id === 'agent-order-cancel-fraud-prevention'
      );
      if (!preventionIssue) {
        return dispatchAppRequestResult({
          status: 'error',
          requestId: 'BackofficeOrderDrawer-cancellation-valid',
          message: {
            title: 'Não foi possível cancelar o pedido.',
            description: 'O motivo do cancelamento não foi encontrado.',
          },
        });
      }
      const cancellationData = {
        orderId,
        params: { refund: ['platform', 'products', 'delivery'] },
        acknowledgedCosts: 0,
        cancellation: preventionIssue,
      } as CancelOrderPayload;
      if (message) cancellationData.comment = message;
      // add flagged location
      const coordinates = new GeoPoint(
        order?.destination?.location?.latitude!,
        order?.destination?.location?.longitude!
      );
      const address = order?.destination?.address;
      if (!coordinates || !address) {
        return dispatchAppRequestResult({
          status: 'error',
          requestId: 'BackofficeOrderDrawer-cancellation-valid',
          message: {
            title: 'Não foi possível cancelar o pedido.',
            description: 'Endereço de destino não encontrado.',
          },
        });
      }
      if (type === 'prevention') setLoadingState('preventCancel');
      addFlaggedLocation({
        coordinates,
        address,
      });
      // cancel order
      return cancelOrder(cancellationData);
    }
    if (!issue) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'BackofficeOrderDrawer-cancellation-valid',
        message: {
          title: 'Não foi possível cancelar o pedido.',
          description: 'Favor informar quem solicitou o cancelamento.',
        },
      });
    }
    const cancellationData = {
      orderId,
      params: { refund },
      acknowledgedCosts: orderCancellationCosts,
      cancellation: issue,
    } as CancelOrderPayload;
    if (message) cancellationData.comment = message;
    return cancelOrder(cancellationData);
  };
  const updateOrderStatus = async (value?: OrderStatus) => {
    if (value) {
      updateOrder({ status: value });
      return;
    }
    if (status === 'canceled') {
      cancellation();
      return;
    }
    let changes = { status } as Partial<Order>;
    if (dispatchingState) changes.dispatchingState = dispatchingState;
    updateOrder(changes);
  };
  // side effects
  React.useEffect(() => {
    if (order?.status) setStatus(order.status);
    if (order?.dispatchingState) setDispatchingState(order.dispatchingState);
  }, [order?.status, order?.dispatchingState]);
  React.useEffect(() => {
    if (orderCancellation) {
      setIssue(orderCancellation.issue ?? null);
      setMessage(orderCancellation.comment ?? '');
      setRefund(orderCancellation.params?.refund ?? []);
    } else if (orderCancellation === null) setRefund([]);
  }, [orderCancellation]);
  React.useEffect(() => {
    if (updateResult.isLoading) setLoadingState('general');
    if (cancelResult.isLoading)
      setLoadingState((prev) => {
        if (prev === 'idle') return 'general';
        return prev;
      });
    else setLoadingState('idle');
  }, [updateResult.isLoading, cancelResult.isLoading]);
  React.useEffect(() => {
    if (!deleteOrderResult.isSuccess) return;
    onClose();
  }, [deleteOrderResult.isSuccess, onClose]);
  //UI
  return (
    <ConsumerProvider>
      <OrderBaseDrawer
        order={order}
        onClose={onClose}
        message={message}
        handleIssueOrder={handleIssueOrder}
        handleIssueOrderLoading={updateResult.isLoading}
        updateState={updateState}
        updateOrderStatus={updateOrderStatus}
        updateOrderStaff={handleUpdateOrderStaff}
        updateStaffResult={updateOrderStaffResult}
        cancellation={cancellation}
        loadingState={loadingState}
        deleteOrder={deleteQuoteOrder}
        deleteLoading={deleteOrderResult.isLoading}
        {...props}
      >
        <Switch>
          <Route exact path={`${path}`}>
            <Participants order={order} />
          </Route>
          <Route exact path={`${path}/order`}>
            <>
              <OrderDetails order={order} />
              <OrderIssuesTable issues={orderIssues} />
            </>
          </Route>
          <Route exact path={`${path}/invoices`}>
            <Invoices
              invoices={invoices}
              logs={logs as WithId<OrderPaymentLog>[] | undefined}
            />
          </Route>
          <Route exact path={`${path}/matching`}>
            <Matching order={order} />
          </Route>
          <Route exact path={`${path}/status`}>
            <OrderStatusBar
              orderId={orderId}
              orderType={order?.type}
              orderStatus={order?.status}
              fulfillment={order?.fulfillment}
              status={status}
              dispatchingState={dispatchingState}
              issue={issue}
              message={message}
              cancelOptions={cancelOptions}
              refund={refund}
              refundValue={refundValue}
              onRefundingChange={onRefundingChange}
              updateState={updateState}
              courierId={order?.courier?.id}
            />
          </Route>
          <Route exact path={`${path}/chats`}>
            <OrderChats groups={orderChatGroup} />
          </Route>
        </Switch>
      </OrderBaseDrawer>
    </ConsumerProvider>
  );
};
