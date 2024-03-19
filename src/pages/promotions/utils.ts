import { CouponType } from '@appjusto/types';

export const getCouponTypeLabel = (type: CouponType) => {
  let label = 'N/E';
  if (type === 'delivery-free') label = 'Entrega grátis';
  else if (type === 'delivery-discount') label = 'Desconto na entrega';
  else if (type === 'food-discount') label = 'Desconto nos produtos';
  else if (type === 'referral') label = 'Desconto da plataforma';
  return label;
};

export const couponParser = (value: string | undefined) => {
  if (!value) return '';
  return value.replace(/[^0-9A-Za-z]/g, '').toUpperCase();
};
