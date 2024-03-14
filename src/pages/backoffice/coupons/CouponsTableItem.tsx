import { Coupon, WithId } from '@appjusto/types';
import { Icon } from '@chakra-ui/react';
import TableItem from 'common/components/backoffice/TableItem';
import React from 'react';
import { useRouteMatch } from 'react-router';
import { getDateAndHour } from 'utils/functions';

interface CouponsTableItemProps {
  coupon: WithId<Coupon>;
}

export const CouponsTableItem = ({ coupon }: CouponsTableItemProps) => {
  // context
  const { path } = useRouteMatch();
  // helpers
  const color = coupon.enabled ? 'green.500' : 'gray.200';
  // UI
  return (
    <TableItem
      key={coupon.id}
      link={`${path}/${coupon.id}`}
      columns={[
        { value: coupon.code },
        { value: coupon.type },
        { value: getDateAndHour(coupon.createdAt) },
        {
          value: (
            <Icon mt="-2px" viewBox="0 0 200 200" color={color}>
              <path
                fill="currentColor"
                d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
              />
            </Icon>
          ),
          styles: { textAlign: 'center' },
        },
      ]}
    />
  );
};
