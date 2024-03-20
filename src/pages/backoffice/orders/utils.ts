import { Order, WithId } from '@appjusto/types';

export const getFoodOrderTotal = (
  order?: WithId<Order> | null,
  isBackoffice?: boolean
) => {
  if (!order) return 0;
  // backoffice drawer and table items shows total value
  if (isBackoffice) return order.fare?.total ?? 0;
  // business value to display in admin drawer and table items
  const isBusinessPaid = order.fare?.business?.paid !== undefined;
  const isCourierPaid = order.fare?.courier?.paid !== undefined;
  const isBusinessCoupon = order.coupon?.createdBy.flavor === 'business';
  const isProductsCoupon = order.coupon?.type === 'food-discount';

  let businessValue = isBusinessPaid
    ? order.fare?.business?.paid!
    : order.fare?.business?.value ?? 0;
  // if invoice not paid and business coupon
  if (!isBusinessPaid && isBusinessCoupon) {
    businessValue -= order.fare?.discount ?? 0;
  }
  // if invoice paid and business delivery coupon
  if (isBusinessPaid && isBusinessCoupon && !isProductsCoupon) {
    businessValue -= order.fare?.discount ?? 0;
  }
  // if outsourced by business it should be added to courier`s value
  if (order.fare?.courier?.payee === 'business') {
    let courierValue = isCourierPaid
      ? order.fare?.courier?.paid!
      : order.fare?.courier?.value ?? 0;
    businessValue += courierValue;
  }
  // return business value to display
  return businessValue;
};
