import { Order, WithId } from '@appjusto/types';
import { Box } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import appjustoLogo from 'common/img/logo-black.svg';
import React from 'react';
import { getOrderToPrint } from './print';

interface OrderToPrintProps {
  order?: WithId<Order> | null;
}

export const OrderToPrinting2 = ({ order }: OrderToPrintProps) => {
  // context
  const { logo } = useBusinessProfile();
  // UI - Hidden
  if (!order) return <Box />;
  const htmlString = getOrderToPrint(order, logo, appjustoLogo);
  const template = { __html: htmlString };
  return <div dangerouslySetInnerHTML={template} />;
};
