import { OrderItemComplement, OrderItem, Order, WithId, OrderStatus } from 'appjusto-types';
import { formatCurrency, formatDate } from './formatters';
import { round } from 'lodash';
import { CroppedAreaProps } from 'common/components/ImageCropping';
import { localOrderType } from 'app/state/order';
import I18n from 'i18n-js';
import firebase from 'firebase/app';
import { AlgoliaCreatedOn } from 'app/api/types';
import { ImageType } from 'common/components/ImageUploads';
import { useLocation } from 'react-router-dom';

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
    'Em cotação',
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

export const getDateAndHour = (timestamp?: firebase.firestore.FieldValue | Date) => {
  if (!timestamp) return 'N/E';
  try {
    let timeToDate = timestamp;
    if (!(timeToDate instanceof Date)) {
      timeToDate = (timestamp as firebase.firestore.Timestamp).toDate();
    }
    const date = I18n.strftime(timeToDate, '%d/%m/%Y');
    const hour = I18n.strftime(timeToDate, '%H:%M');
    return `${date} ${hour}`;
  } catch (error) {
    console.log(error);
    return 'N/E';
  }
};

export const getAlgoliaFieldDateAndHour = (timestamp: firebase.firestore.FieldValue | number) => {
  if (typeof timestamp === 'number') {
    try {
      const date = new Date(timestamp).toLocaleDateString();
      const hour = new Date(timestamp).toLocaleTimeString();
      return `${date} - ${hour}`;
    } catch (error) {
      console.log(error);
      return 'Erro';
    }
  } else {
    try {
      const date = new Date(
        ((timestamp as unknown) as AlgoliaCreatedOn)._seconds * 1000
      ).toLocaleDateString();
      const hour = new Date(
        ((timestamp as unknown) as AlgoliaCreatedOn)._seconds * 1000
      ).toLocaleTimeString();
      return `${date} - ${hour}`;
    } catch (error) {
      console.log(error);
      return 'Erro';
    }
  }
};

// Orders times
export const updateLocalStorageOrders = (orders: WithId<Order>[], soundAlert: any) => {
  if (orders.length > 0) {
    const filteredOrders = orders
      .filter((order) => order.status === 'confirmed' || order.status === 'preparing')
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
  if (localOrdersArray) {
    const newArray = localOrdersArray.map((item: localOrderType) => {
      if (item.code === orderId) {
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

export const getTimeUntilNow = (baseTime: number, reverse: boolean = false) => {
  const now = new Date().getTime();
  if (reverse) {
    let elapsedTime = (baseTime - now) / 1000 / 60;
    if (elapsedTime < 0) elapsedTime = 0;
    return round(elapsedTime, 0);
  }
  const elapsedTime = (now - baseTime) / 1000 / 60;
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

export const getOrderTotalPrice = (items: OrderItem[]) => {
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
) => formatCurrency(getProductTotalPrice(price, complements));

export const getOrderTotalPriceToDisplay = (items: OrderItem[]) =>
  formatCurrency(getOrderTotalPrice(items));

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
  resizedWidth: number,
  imageType: ImageType = 'image/jpeg'
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
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
          const result = await getResizedImage(url, ratio, resizedWidth, imageType);
          resolve(result);
        } catch (error) {
          console.log('getCroppedImg Error', error);
          reject(null);
        }
      }, imageType);
    });
  }
};

export const getResizedImage = async (
  imageSrc: string,
  ratio: number,
  resizedWidth: number,
  imageType: ImageType = 'image/jpeg'
) => {
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
    //ctx.fillStyle = 'white';
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
    return new Promise((resolve) => {
      canvas.toBlob((file) => {
        resolve(file);
      }, imageType);
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

// orders
export const getOrderCancellator = (issueIype?: string) => {
  let cancelator = 'N/E';
  if (issueIype === 'restaurant-cancel') cancelator = 'Restaurante';
  if (issueIype === 'consumer-cancel') cancelator = 'Cliente';
  if (issueIype === 'courier-cancel') cancelator = 'Entregador';
  if (issueIype === 'agent-order-cancel') cancelator = 'Agente Appjusto';
  return cancelator;
};

// url
export const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};
