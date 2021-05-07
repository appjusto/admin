import { useOrder } from 'app/api/order/useOrder';
import { useIssuesByType } from 'app/api/platform/useIssuesByTypes';
import { useContextAgentProfile } from 'app/state/agent/context';
import { ConsumerProvider } from 'app/state/consumer/context';
import { Issue, IssueType, OrderStatus, WithId } from 'appjusto-types';
import React from 'react';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import { Details } from './Details';
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
  const { order, updateOrder, updateResult, cancelOrder, orderIssues } = useOrder(orderId);
  const cancelOptions = useIssuesByType(cancelOptionsArray);

  // state
  const [status, setStatus] = React.useState<OrderStatus | undefined>(order?.status ?? undefined);
  const [issue, setIssue] = React.useState<WithId<Issue> | null>();
  const [message, setMessage] = React.useState('');

  // helpers

  //handlers
  const updateState = (type: string, value: OrderStatus | WithId<Issue> | string) => {
    if (type === 'status') setStatus(value as OrderStatus);
    else if (type === 'issue') setIssue(cancelOptions?.find((item) => item.id === value) ?? null);
    else if (type === 'message') setMessage(value as string);
  };

  const updateOrderStatus = async () => {
    if (status === 'canceled') {
      const issueData = {
        issue,
        comment: message,
      } as { issue: WithId<Issue>; comment?: string };
      await cancelOrder(issueData);
    } else {
      const changes = {
        status,
      };
      await updateOrder(changes);
    }
  };

  // side effects
  React.useEffect(() => {
    if (order?.status) setStatus(order.status);
  }, [order?.status]);

  React.useEffect(() => {
    if (orderIssues) {
      setIssue(orderIssues[0]?.issue ?? null);
      setMessage(orderIssues[0].comment ?? '');
    }
  }, [orderIssues]);

  //UI
  return (
    <ConsumerProvider>
      <OrderBaseDrawer
        agent={{ id: agent?.id, name: username }}
        order={order}
        onClose={onClose}
        updateOrderStatus={updateOrderStatus}
        result={updateResult}
        {...props}
      >
        <Switch>
          <Route exact path={`${path}`}>
            <Participants order={order} />
          </Route>
          <Route exact path={`${path}/order`}>
            <Details order={order} />
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
