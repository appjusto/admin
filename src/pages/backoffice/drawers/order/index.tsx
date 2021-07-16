import { useOrder } from 'app/api/order/useOrder';
import { useIssuesByType } from 'app/api/platform/useIssuesByTypes';
import { useContextAgentProfile } from 'app/state/agent/context';
import { ConsumerProvider } from 'app/state/consumer/context';
import {
  CancelOrderPayload,
  InvoiceType,
  Issue,
  IssueType,
  OrderStatus,
  WithId,
} from 'appjusto-types';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import { OrderDetails } from 'pages/orders/drawers/orderdrawer/OrderDetails';
import { OrderIssuesTable } from 'pages/orders/drawers/orderdrawer/OrderIssuesTable';
import React from 'react';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import { Invoices } from './Invoices';
import { Matching } from './Matching';
import { OrderBaseDrawer } from './OrderBaseDrawer';
import { OrderStatusBar } from './OrderStatusBar';
import { Participants } from './Participants';

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
  const { path } = useRouteMatch();
  const { agent, username } = useContextAgentProfile();
  const { orderId } = useParams<Params>();
  const {
    order,
    invoices,
    updateOrder,
    updateResult,
    cancelOrder,
    cancelResult,
    orderIssues,
    orderCancellation,
    orderCancellationCosts,
  } = useOrder(orderId);
  const cancelOptions = useIssuesByType(cancelOptionsArray);

  // state
  const [status, setStatus] = React.useState<OrderStatus | undefined>(order?.status ?? undefined);
  const [issue, setIssue] = React.useState<Issue | null>();
  const [message, setMessage] = React.useState<string>();
  const [refund, setRefund] = React.useState<InvoiceType[]>(['platform', 'products', 'delivery']);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState(initialError);

  // refs
  const submission = React.useRef(0);

  // helpers
  let refundValue = 0;
  if (refund.includes('platform') && order?.fare?.platform?.value)
    refundValue += order.fare.platform.value;
  if (refund.includes('products') && order?.fare?.business?.value)
    refundValue += order.fare.business.value;
  if (refund.includes('delivery') && order?.fare?.courier?.value)
    refundValue += order.fare.courier.value;

  //handlers
  const updateState = (type: string, value: OrderStatus | WithId<Issue> | string) => {
    if (type === 'status') setStatus(value as OrderStatus);
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

  const cancellation = () => {
    if (!issue) {
      return setError({
        status: true,
        error: null,
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

  const updateOrderStatus = async () => {
    submission.current += 1;
    if (status === 'canceled') {
      cancellation();
    } else {
      const changes = {
        status,
      };
      return updateOrder(changes);
    }
  };

  // side effects
  React.useEffect(() => {
    if (order?.status) setStatus(order.status);
  }, [order?.status]);

  React.useEffect(() => {
    if (orderCancellation) {
      setIssue(orderCancellation.issue ?? null);
      setMessage(orderCancellation.comment ?? '');
      setRefund(orderCancellation.params.refund);
    } else if (orderCancellation === null) setRefund([]);
  }, [orderCancellation]);

  React.useEffect(() => {
    if (updateResult.isLoading || cancelResult.isLoading) setIsLoading(true);
    else setIsLoading(false);
  }, [updateResult.isLoading, cancelResult.isLoading]);

  React.useEffect(() => {
    if (updateResult.isSuccess || cancelResult.isSuccess) setIsSuccess(true);
    else setIsSuccess(false);
  }, [updateResult.isSuccess, cancelResult.isSuccess]);

  React.useEffect(() => {
    if (updateResult.isError) {
      setError({
        status: true,
        error: updateResult.error,
      });
    } else if (cancelResult.isError) {
      setError({
        status: true,
        error: cancelResult.error,
      });
    }
  }, [updateResult.isError, updateResult.error, cancelResult.isError, cancelResult.error]);

  //UI
  return (
    <ConsumerProvider>
      <SuccessAndErrorHandler
        submission={submission.current}
        isSuccess={isSuccess}
        isError={error.status}
        error={error.error}
        errorMessage={error.message}
      />
      <OrderBaseDrawer
        agent={{ id: agent?.id, name: username }}
        order={order}
        onClose={onClose}
        updateOrderStatus={updateOrderStatus}
        isLoading={isLoading}
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
            <Matching
              orderId={orderId}
              orderStatus={order?.status}
              orderDispatchingStatus={order?.dispatchingStatus}
            />
          </Route>
          <Route exact path={`${path}/status`}>
            <OrderStatusBar
              orderType={order?.type}
              orderStatus={order?.status}
              status={status}
              issue={issue}
              message={message}
              cancelOptions={cancelOptions}
              refund={refund}
              refundValue={refundValue}
              onRefundingChange={onRefundingChange}
              updateState={updateState}
            />
          </Route>
        </Switch>
      </OrderBaseDrawer>
    </ConsumerProvider>
  );
};
