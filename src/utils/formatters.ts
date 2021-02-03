import { separator, unit } from 'common/components/form/input/currency-input/utils';
import { OrderItemComplement, OrderItem } from 'appjusto-types';

export const itemPriceFormatter = (price: number) => {
  const pStr = price.toString();
  const len = pStr.length;
  const pArr = pStr.split('');
  if (len === 4) return `${unit} ${pArr[0]}${pArr[1]}${separator}${pArr[2]}${pArr[3]}`;
  if (len === 3) return `${unit} ${pArr[0]}${separator}${pArr[1]}${pArr[2]}`;
  if (len === 2) return `${unit} 0${separator}${pArr[0]}${pArr[1]}`;
  if (len === 1) return `${unit} 0${separator}0${pArr[0]}`;
};

const getProductTotalPrice = (price: number, complements: OrderItemComplement[] | undefined) => {
  let complementsPrice = 0;
  if (complements) {
    complementsPrice =
      complements.reduce((n1: number, n2: OrderItemComplement) => n1 + n2.price, 0) || 0;
  }
  return price + complementsPrice;
};
const getOrderTotalPrice = (items: OrderItem[]) => {
  let total = 0;
  items.map((item: OrderItem) => {
    let priceByquantity = item.quantity * item.product.price;
    return (total += getProductTotalPrice(priceByquantity, item.complements));
  });
  return total;
};

export const getProdTotalPriceToDisplay = (
  price: number,
  complements: OrderItemComplement[] | undefined
) => itemPriceFormatter(getProductTotalPrice(price, complements));
export const getOrderTotalPriceToDisplay = (items: OrderItem[]) =>
  itemPriceFormatter(getOrderTotalPrice(items));
