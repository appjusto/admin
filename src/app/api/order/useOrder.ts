import { useContextApi } from 'app/state/api/context';
import { Issue, Order, OrderIssue, WithId } from 'appjusto-types';
import React from 'react';
import { useMutation } from 'react-query';

export const useOrder = (orderId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [order, setOrder] = React.useState<WithId<Order> | null>();
  const [orderIssues, setOrderIssues] = React.useState<WithId<OrderIssue>[] | null>();

  // handlers
  const [updateOrder, updateResult] = useMutation(async (changes: Partial<Order>) =>
    api.order().updateOrder(orderId!, changes)
  );

  const [cancelOrder, cancelResult] = useMutation(
    async (issueData: { issue: WithId<Issue>; comment?: string }) => {
      await api.order().cancelOrder(orderId!, issueData.issue, issueData.comment);
    }
  );
  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    const getOrderById = async () => {
      const data = await api.order().fetchOrderById(orderId);
      setOrder(data as WithId<Order>);
    };
    const getOrderIssues = async () => {
      const issues = await api.order().getOrderIssues(orderId);
      setOrderIssues(issues);
    };
    getOrderById();
    getOrderIssues();
  }, [api, orderId]);

  // return
  return { order, updateOrder, updateResult, cancelOrder, cancelResult, orderIssues };
};
