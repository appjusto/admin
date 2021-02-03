import { OrderItemComplement, OrderItem } from 'appjusto-types';
import { itemPriceFormatter, formatDate } from './formatters';

//date
export const getDateTime = () => {
  let fullDate = new Date();
  let date = formatDate(fullDate);
  let time = `${fullDate.getHours()}:${fullDate.getMinutes()}`;
  return { date, time };
};

// pricing
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
