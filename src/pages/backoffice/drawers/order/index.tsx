import { useOrder } from 'app/api/order/useOrder';
import { useContextAgentProfile } from 'app/state/agent/context';
import { ConsumerProvider } from 'app/state/consumer/context';
import { IssueType, OrderStatus } from 'appjusto-types';
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

export const BackofficeOrderDrawer = ({ onClose, ...props }: ConsumerDrawerProps) => {
  //context
  const { path } = useRouteMatch();
  const { agent, username } = useContextAgentProfile();
  const { orderId } = useParams<Params>();
  const { order, updateOrder, updateResult } = useOrder(orderId);

  // state
  const [status, setStatus] = React.useState<OrderStatus | undefined>(order?.status ?? undefined);
  const [issue, setIssue] = React.useState<IssueType>();
  const [message, setMessage] = React.useState('');

  // helpers

  //handlers
  const updateState = (type: string, value: OrderStatus | IssueType | string) => {
    if (type === 'status') setStatus(value as OrderStatus);
    else if (type === 'issue') setIssue(value as IssueType);
    else if (type === 'message') setMessage(value);
  };

  const updateOrderStatus = async () => {
    const changes = {
      status,
    };
    await updateOrder(changes);
  };

  // side effects
  React.useEffect(() => {
    if (order?.status) setStatus(order.status);
  }, [order?.status]);

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
              updateState={updateState}
            />
          </Route>
        </Switch>
      </OrderBaseDrawer>
    </ConsumerProvider>
  );
};
