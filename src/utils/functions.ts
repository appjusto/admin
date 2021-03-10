import { OrderItemComplement, OrderItem, Order, WithId, OrderStatus } from 'appjusto-types';
import { itemPriceFormatter, formatDate } from './formatters';
import { round } from 'lodash';
import { CroppedAreaProps } from 'common/components/ImageCropping';
import { localOrderType } from 'pages/orders/context';

// translation
export const getTranslatedOrderStatus = (status: OrderStatus) => {
  const en = [
    'quote',
    'confirming',
    'confirmed',
    'preparing',
    'ready',
    'dispatching',
    'delivered',
    'canceled',
  ];
  const pt = [
    'Na fila',
    'Aguardando confirmação',
    'Confirmado',
    'Em preparo',
    'Pedido pronto',
    'Despachando',
    'Entregue',
    'Cancelado',
  ];
  const index = en.indexOf(status);
  return pt[index];
};

//date
export const getDateTime = () => {
  let fullDate = new Date();
  let date = formatDate(fullDate);
  let minutes = fullDate.getMinutes().toString();
  if (minutes.length === 1) minutes = `0${minutes}`;
  let time = `${fullDate.getHours()}:${minutes}`;
  return { date, time };
};

// Orders times
export const updateLocalStorageOrders = (orders: WithId<Order>[], soundAlert: any) => {
  if (orders.length > 0) {
    const filteredOrders = orders
      .filter((order) => order.status === 'confirming' || order.status === 'preparing')
      .map((order) => order.id);
    const storageItem = localStorage.getItem('appjusto-orders');
    const localOrders: localOrderType[] = storageItem ? JSON.parse(storageItem) : [];
    const localOrdersIds = localOrders.map((order) => order.code);

    filteredOrders.forEach((orderId) => {
      const isNew = localOrdersIds.includes(orderId) === false;
      if (isNew) {
        soundAlert();
        localOrders.push({ code: orderId, time: new Date().getTime() });
      }
    });

    const filteredLocalOrder = localOrders.filter((item) => filteredOrders.includes(item.code));
    localStorage.setItem('appjusto-orders', JSON.stringify(filteredLocalOrder));
  }
};

export const getLocalStorageOrderTime = (orderId: string) => {
  const localOrders = localStorage.getItem('appjusto-orders');
  const localOrdersArray = localOrders ? JSON.parse(localOrders) : null;
  if (localOrdersArray) {
    const order = localOrdersArray.find((item: localOrderType) => item.code === orderId);
    return order ? order.time : null;
  }
  return null;
};

export const updateLocalStorageOrderTime = (orderId: string) => {
  const localOrders = localStorage.getItem('appjusto-orders');
  const localOrdersArray = localOrders ? JSON.parse(localOrders) : null;
  console.log(localOrdersArray);
  if (localOrdersArray) {
    const newArray = localOrdersArray.map((item: localOrderType) => {
      if (item.code === orderId) {
        console.log(orderId);
        return { ...item, time: new Date().getTime() };
      } else {
        return item;
      }
    });
    localStorage.setItem('appjusto-orders', JSON.stringify(newArray));
    return true;
  }
  return false;
};

export const getTimeUntilNow = (created: number, reverse: boolean = false) => {
  const now = new Date().getTime();
  if (reverse) {
    let elapsedTime = (created - now) / 1000 / 60;
    if (elapsedTime < 0) elapsedTime = 0;
    return round(elapsedTime, 0);
  }
  const elapsedTime = (now - created) / 1000 / 60;
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

const getRadianAngle = (degreeValue: number) => {
  return (degreeValue * Math.PI) / 180;
};

export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: CroppedAreaProps,
  //rotation = 0,
  ratio: number,
  resizedWidth: number
) => {
  const image = (await createImage(imageSrc)) as HTMLImageElement;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));
  // set each dimensions to double largest dimension to allow for a safe area for the
  // image to rotate in without being clipped by canvas context
  canvas.width = safeArea;
  canvas.height = safeArea;
  if (ctx) {
    // translate canvas context to a central location on image to allow rotating around the center.
    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate(getRadianAngle(0));
    ctx.translate(-safeArea / 2, -safeArea / 2);
    // draw rotated image and store data.
    ctx.drawImage(image, safeArea / 2 - image.width * 0.5, safeArea / 2 - image.height * 0.5);
    const data = ctx.getImageData(0, 0, safeArea, safeArea);
    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    // paste generated rotate image with correct offsets for x,y crop values.
    ctx.putImageData(
      data,
      Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
      Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
    );
    // As Base64 string
    // return canvas.toDataURL('image/jpeg');
    // As a blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(async (file) => {
        try {
          const url = URL.createObjectURL(file);
          const rsult = await getResizedImage(url, ratio, resizedWidth);
          resolve(rsult);
        } catch (error) {
          console.log('getCroppedImg Error', error);
          reject(null);
        }
      }, 'image/jpeg');
    });
  }
};

export const getResizedImage = async (imageSrc: string, ratio: number, resizedWidth: number) => {
  const image = (await createImage(imageSrc)) as HTMLImageElement;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const pixelRatio = window.devicePixelRatio;
  canvas.width = resizedWidth * pixelRatio;
  canvas.height = (resizedWidth / ratio) * pixelRatio;
  if (ctx) {
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(image, 0, 0, resizedWidth, resizedWidth / ratio);
    return new Promise((resolve) => {
      canvas.toBlob((file) => {
        resolve(file);
      }, 'image/jpeg');
    });
  }
};

// geo
type latLng = {
  lat: number;
  lng: number;
};
export const getCoordinatesMidpoint = (origin: latLng, destination: latLng) => {
  try {
    let midLat =
      origin.lat > destination.lat
        ? (origin.lat - destination.lat) / 2 + destination.lat
        : (destination.lat - origin.lat) / 2 + origin.lat;
    let midLng =
      origin.lng > destination.lng
        ? (origin.lng - destination.lng) / 2 + destination.lng
        : (destination.lng - origin.lng) / 2 + origin.lng;
    return { lat: midLat, lng: midLng };
  } catch {
    return undefined;
  }
};
