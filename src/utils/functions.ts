import { OrderItemComplement, OrderItem } from 'appjusto-types';
import { itemPriceFormatter, formatDate } from './formatters';
import { round } from 'lodash';

//date
export const getDateTime = () => {
  let fullDate = new Date();
  let date = formatDate(fullDate);
  let time = `${fullDate.getHours()}:${fullDate.getMinutes()}`;
  return { date, time };
};

export const getTimeUntilNow = (created: firebase.firestore.Timestamp) => {
  const start = created.toDate().getTime();
  const now = new Date().getTime();
  const elapsedTime = (now - start) / 1000 / 60;
  return round(elapsedTime, 0);
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

// images
const createImage = (url: string) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

export const getCroppedImage = async (url: string, imageRatio: number = 9 / 16) => {
  const image = await createImage(url);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const pixelRatio = window.devicePixelRatio;
  // @ts-ignore: Unreachable code error
  const drawerWidth = image.naturalWidth * pixelRatio;
  // @ts-ignore: Unreachable code error
  const drawerHeight = image.naturalWidth * imageRatio * pixelRatio;
  canvas.width = drawerWidth;
  canvas.height = drawerHeight;
  if (ctx) {
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';
    // @ts-ignore: Unreachable code error
    ctx.drawImage(image, 0, 0, drawerWidth, drawerHeight, 0, 0, drawerWidth, drawerHeight);
    // @ts-ignore: Unreachable code error
    //canvas.toBlob((blob) => console.log(blob));
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob: any) => {
          blob.name = 'imageName';
          resolve(blob);
        },
        'image/jpeg',
        1
      );
    });
  }
  return null;
};
