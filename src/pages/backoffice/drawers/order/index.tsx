import { useObserveOrderChatMessages } from 'app/api/chat/useObserveOrderChatMessages';
import { useObserveOrderInvoices } from 'app/api/order/useObserveOrderInvoices';
import { useOrder } from 'app/api/order/useOrder';
import { useFlaggedLocations } from 'app/api/platform/useFlaggedLocations';
import { useIssuesByType } from 'app/api/platform/useIssuesByTypes';
import { useContextAgentProfile } from 'app/state/agent/context';
import { ConsumerProvider } from 'app/state/consumer/context';
import { useContextAppRequests } from 'app/state/requests/context';
import {
  CancelOrderPayload,
  DispatchingState,
  InvoiceType,
  Issue,
  IssueType,
  Order,
  OrderStatus,
  WithId,
} from 'appjusto-types';
import firebase from 'firebase/app';
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

export type OrderDrawerLoadingState = 'idle' | 'preventCancel' | 'preventConfirm' | 'general';

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

export const BackofficeOrderDrawer = ({ onClose, ...props }: ConsumerDrawerProps) => {
  //context
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { path } = useRouteMatch();
  const { agent, username } = useContextAgentProfile();
  const { orderId } = useParams<Params>();
  const {
    order,
    updateOrder,
    updateResult,
    cancelOrder,
    cancelResult,
    orderIssues,
    orderCancellation,
    orderCancellationCosts,
  } = useOrder(orderId);
  const invoices = useObserveOrderInvoices(order?.id);
  const cancelOptions = useIssuesByType(cancelOptionsArray);
  const { addFlaggedLocation } = useFlaggedLocations();
  const { chatMessages, orderChatGroup } = useObserveOrderChatMessages(order?.id, 1);
  // state
  const [status, setStatus] = React.useState<OrderStatus | undefined>(order?.status);
  const [dispatchingState, setDispatchingState] = React.useState<DispatchingState | undefined>(
    order?.dispatchingState
  );
  const [issue, setIssue] = React.useState<Issue | null>();
  const [message, setMessage] = React.useState<string>();
  const [refund, setRefund] = React.useState<InvoiceType[]>(['platform', 'products', 'delivery']);
  const [loadingState, setLoadingState] = React.useState<OrderDrawerLoadingState>('idle');
  // helpers
  const isChatMessages = chatMessages ? chatMessages?.length > 0 : false;
  let refundValue = 0;
  if (refund.includes('platform') && order?.fare?.platform?.value)
    refundValue += order.fare.platform.value;
  if (refund.includes('products') && order?.fare?.business?.value)
    refundValue += order.fare.business.value;
  if (refund.includes('delivery') && order?.fare?.courier?.value)
    refundValue += order.fare.courier.value;
  //handlers
  const updateState = (
    type: 'status' | 'dispatchingState' | 'issue' | 'message',
    value: OrderStatus | WithId<Issue> | string
  ) => {
    if (type === 'status') setStatus(value as OrderStatus);
    else if (type === 'dispatchingState') setDispatchingState(value as DispatchingState);
    else if (type === 'issue') setIssue(cancelOptions?.find((item) => item.id === value) ?? null);
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
    if (type === 'prevention' || issue?.id === 'agent-order-cancel-fraud-prevention') {
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
      const coordinates = new firebase.firestore.GeoPoint(
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
      setRefund(orderCancellation.params.refund);
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
  //UI
  return (
    <ConsumerProvider>
      <OrderBaseDrawer
        agent={{ id: agent?.id, name: username }}
        order={order}
        onClose={onClose}
        updateOrderStatus={updateOrderStatus}
        cancellation={cancellation}
        loadingState={loadingState}
        isChatMessages={isChatMessages}
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
            <Invoices invoices={invoices} />
          </Route>
          <Route exact path={`${path}/matching`}>
            <Matching order={order} />
          </Route>
          <Route exact path={`${path}/status`}>
            <OrderStatusBar
              orderType={order?.type}
              orderStatus={order?.status}
              status={status}
              dispatchingState={dispatchingState}
              issue={issue}
              message={message}
              cancelOptions={cancelOptions}
              refund={refund}
              refundValue={refundValue}
              onRefundingChange={onRefundingChange}
              updateState={updateState}
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
