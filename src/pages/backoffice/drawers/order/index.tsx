import { useOrder } from 'app/api/order/useOrder';
import { useIssuesByType } from 'app/api/platform/useIssuesByTypes';
import { useContextAgentProfile } from 'app/state/agent/context';
import { ConsumerProvider } from 'app/state/consumer/context';
import { Issue, IssueType, OrderStatus, WithId } from 'appjusto-types';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import { OrderDetails } from 'pages/orders/drawers/orderdrawer/OrderDetails';
import { OrderIssuesTable } from 'pages/orders/drawers/orderdrawer/OrderIssuesTable';
import React from 'react';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
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

export const BackofficeOrderDrawer = ({ onClose, ...props }: ConsumerDrawerProps) => {
  //context
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
  } = useOrder(orderId);
  const cancelOptions = useIssuesByType(cancelOptionsArray);

  // state
  const [status, setStatus] = React.useState<OrderStatus | undefined>(order?.status ?? undefined);
  const [issue, setIssue] = React.useState<Issue | null>();
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState(initialError);

  // helpers
  const submission = React.useRef(0);

  //handlers
  const updateState = (type: string, value: OrderStatus | WithId<Issue> | string) => {
    if (type === 'status') setStatus(value as OrderStatus);
    else if (type === 'issue') setIssue(cancelOptions?.find((item) => item.id === value) ?? null);
    else if (type === 'message') setMessage(value as string);
  };

  const updateOrderStatus = async () => {
    if (status === 'canceled') {
      if (!agent?.id || !agent?.name) {
        console.dir({
          error: 'Order cancellation incomplete',
          id: agent?.id,
          name: agent?.name,
        });
        return;
      }
      /*const cancellationData = {
        issue,
        canceledById: agent?.id,
        comment: message,
      } as CancellationData;*/
      //await cancelOrder(cancellationData);
      // Fix handle errors
    } else {
      const changes = {
        status,
      };
      await updateOrder(changes);
    }
    submission.current += 1;
  };

  // side effects
  React.useEffect(() => {
    if (order?.status) setStatus(order.status);
  }, [order?.status]);

  React.useEffect(() => {
    if (orderCancellation) {
      setIssue(orderCancellation.issue ?? null);
      setMessage(orderCancellation.comment ?? '');
    }
  }, [orderCancellation]);

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
        isSuccess={updateResult.isSuccess}
        isError={error.status}
        error={error.error}
      />
      <OrderBaseDrawer
        agent={{ id: agent?.id, name: username }}
        order={order}
        onClose={onClose}
        updateOrderStatus={updateOrderStatus}
        isLoading={updateResult.isLoading}
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
          <Route exact path={`${path}/matching`}>
            <Matching
              orderId={orderId}
              orderStatus={order?.status}
              orderDispatchingStatus={order?.dispatchingStatus}
            />
          </Route>
          <Route exact path={`${path}/status`}>
            <OrderStatusBar
              status={status}
              issue={issue}
              message={message}
              cancelOptions={cancelOptions}
              updateState={updateState}
            />
          </Route>
        </Switch>
      </OrderBaseDrawer>
    </ConsumerProvider>
  );
};
