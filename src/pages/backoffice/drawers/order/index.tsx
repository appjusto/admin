import { CancellationData } from 'app/api/order/OrderApi';
import { useOrder } from 'app/api/order/useOrder';
import { useIssuesByType } from 'app/api/platform/useIssuesByTypes';
import { useContextAgentProfile } from 'app/state/agent/context';
import { ConsumerProvider } from 'app/state/consumer/context';
import { Issue, IssueType, OrderStatus, WithId } from 'appjusto-types';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { OrderDetails } from 'pages/orders/drawers/orderdrawer/OrderDetails';
import { OrderIssuesTable } from 'pages/orders/drawers/orderdrawer/OrderIssuesTable';
import React from 'react';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
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
  const { order, updateOrder, result, cancelOrder, orderIssues } = useOrder(orderId);
  const cancelOptions = useIssuesByType(cancelOptionsArray);
  const { isLoading, isSuccess, isError, error } = result;

  // state
  const [status, setStatus] = React.useState<OrderStatus | undefined>(order?.status ?? undefined);
  const [issue, setIssue] = React.useState<Issue | null>();
  const [message, setMessage] = React.useState('');

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
      const cancellationData = {
        issue,
        canceledBy: {
          id: agent?.id,
          name: agent?.name,
        },
        comment: message,
      } as CancellationData;
      await cancelOrder(cancellationData);
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
    if (order?.cancellation) {
      setIssue(order.cancellation.issue ?? null);
      setMessage(order.cancellation?.comment ?? '');
    }
  }, [order?.cancellation]);

  //UI
  return (
    <ConsumerProvider>
      <SuccessAndErrorHandler
        submission={submission.current}
        isSuccess={isSuccess}
        isError={isError}
        error={error}
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
          <Route exact path={`${path}/status`}>
            <OrderStatusBar
              status={status}
              issue={issue}
              cancelatorName={order?.cancellation?.canceledBy.name}
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
