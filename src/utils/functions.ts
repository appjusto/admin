import {
  Bank,
  BankAccountPersonType,
  BankAccountType,
  BusinessPhone,
  OrderItem,
  OrderItemComplement,
  OrderStatus,
} from '@appjusto/types';
import { AlgoliaCreatedOn } from 'app/api/types';
import { CroppedAreaProps } from 'common/components/image-uploads/ImageCropping';
import { ImageType } from 'common/components/ImageUploads';
import { FieldValue, Timestamp } from 'firebase/firestore';
import I18n from 'i18n-js';
import { round } from 'lodash';
import { useLocation } from 'react-router-dom';
import { formatCurrency, formatDate } from './formatters';

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
    'scheduled',
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
    'Agendado',
  ];
  const index = en.indexOf(status);
  return pt[index];
};

export const getComplementQtd = (itemQtd?: number, complQtd?: number) => {
  const prod = itemQtd ?? 1;
  const compl = complQtd ?? 1;
  return prod * compl;
};

export const getComplementSubtotal = (
  itemQtd?: number,
  complQtd?: number,
  complPrice?: number
) => {
  const prod = itemQtd ?? 1;
  const compl = complQtd ?? 1;
  const price = complPrice ?? 0;
  return prod * compl * price;
};

export const getProductSubtotal = (
  productQtd?: number,
  productPrice?: number
) => {
  const prod = productQtd ?? 1;
  const price = productPrice ?? 0;
  return prod * price;
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

export const getDateAndHour = (
  timestamp?: FieldValue | Date | null,
  onlyDate?: boolean
) => {
  if (!timestamp) return 'N/E';
  try {
    let timeToDate = timestamp;
    if (!(timeToDate instanceof Date)) {
      timeToDate = (timestamp as Timestamp).toDate();
    }
    const date = I18n.strftime(timeToDate, '%d/%m/%Y');
    const hour = I18n.strftime(timeToDate, '%H:%M');
    if (onlyDate) return date;
    return `${date} ${hour}`;
  } catch (error) {
    // console.log(error);
    return 'N/E';
  }
};

export const formatTimestampToInput = (
  timestamp?: FieldValue | Date | null
) => {
  if (!timestamp) return { date: null, time: null };
  const dateTime = getDateAndHour(timestamp);
  const date = dateTime.split(' ')[0];
  const time = dateTime.split(' ')[1];
  const year = date.split('/')[2];
  const month = date.split('/')[1];
  const day = date.split('/')[0];
  return { date: `${year}-${month}-${day}`, time };
};

export const getHourAndMinute = (timestamp?: FieldValue | Date) => {
  if (!timestamp) return 'N/E';
  try {
    let timeToDate = timestamp;
    if (!(timeToDate instanceof Date)) {
      timeToDate = (timestamp as Timestamp).toDate();
    }
    const hour = I18n.strftime(timeToDate, '%H:%M');
    return hour;
  } catch (error) {
    console.log('getHourAndMinute error: ', error);
    return 'N/E';
  }
};

export const getFullTime = (timestamp?: FieldValue | Date) => {
  if (!timestamp) return 'N/E';
  try {
    let timeToDate = timestamp;
    if (!(timeToDate instanceof Date)) {
      timeToDate = (timestamp as Timestamp).toDate();
    }
    const hour = I18n.strftime(timeToDate, '%H:%M:%S');
    return hour;
  } catch (error) {
    console.log('getFullTime error: ', error);
    return 'N/E';
  }
};

export const getAlgoliaFieldDateAndHour = (timestamp: FieldValue | number) => {
  if (typeof timestamp === 'number') {
    try {
      const date = new Date(timestamp).toLocaleDateString();
      const hour = new Date(timestamp).toLocaleTimeString();
      return `${date} - ${hour}`;
    } catch (error) {
      console.log('getAlgoliaFieldDateAndHour error: ', error);
      return 'Erro';
    }
  } else {
    try {
      const date = new Date(
        (timestamp as unknown as AlgoliaCreatedOn)._seconds * 1000
      ).toLocaleDateString();
      const hour = new Date(
        (timestamp as unknown as AlgoliaCreatedOn)._seconds * 1000
      ).toLocaleTimeString();
      return `${date} - ${hour}`;
    } catch (error) {
      console.log('getAlgoliaFieldDateAndHour error: ', error);
      return 'Erro';
    }
  }
};

export const getTimestampMilliseconds = (timestamp?: Timestamp) => {
  if (!timestamp) return null;
  return timestamp.seconds * 1000;
};

export const getTimeUntilNow = (
  serverTime: number,
  baseTime: number,
  reverse: boolean = false
) => {
  //const now = new Date().getTime();
  if (reverse) {
    let elapsedTime = (baseTime - serverTime) / 1000 / 60;
    if (elapsedTime < 0) elapsedTime = 0;
    return round(elapsedTime, 0);
  }
  const elapsedTime = (serverTime - baseTime) / 1000 / 60;
  return round(elapsedTime, 0);
};

// pricing
const getProductTotalPrice = (
  price: number,
  complements: OrderItemComplement[] | undefined
) => {
  let complementsPrice = 0;
  if (complements) {
    complementsPrice =
      complements.reduce(
        (n1: number, n2: OrderItemComplement) => n1 + n2.price,
        0
      ) || 0;
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
    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5
    );
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
        if (!file) return;
        try {
          const url = URL.createObjectURL(file);
          const result = await getResizedImage(
            url,
            ratio,
            resizedWidth,
            imageType
          );
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
  if (issueIype?.includes('platform')) cancelator = 'Plataforma';
  if (issueIype?.includes('restaurant')) cancelator = 'Restaurante';
  if (issueIype?.includes('consumer')) cancelator = 'Cliente';
  if (issueIype?.includes('courier')) cancelator = 'Entregador';
  if (issueIype?.includes('agent')) cancelator = 'Agente Appjusto';
  return cancelator;
};

// url
export const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

// Banking > CEF
export const getCEFAccountCode = (
  bankingCode: string,
  personType: 'Pessoa Jurídica' | 'Pessoa Física',
  type: BankAccountType
) => {
  let operation = '';
  if (bankingCode !== '104') return operation;
  if (personType === 'Pessoa Jurídica') {
    if (type === 'Corrente') {
      operation = '003';
    } else if (type === 'Poupança') {
      operation = '022';
    }
  } else if (personType === 'Pessoa Física') {
    if (type === 'Corrente') {
      operation = '001';
    } else if (type === 'Simples') {
      operation = '002';
    } else if (type === 'Poupança') {
      operation = '013';
    } else if (type === 'Nova Poupança') {
      operation = '1288';
    }
  }
  return operation;
};

export const getBankingAccountPattern = (
  bank?: Bank,
  personType?: BankAccountPersonType,
  type?: BankAccountType
) => {
  try {
    if (!bank) return '';
    if (!personType || !type) return bank.accountPattern;
    if (bank.code !== '104') return bank.accountPattern;
    const accountCode = getCEFAccountCode(bank.code, personType, type);
    const patternPrefix = accountCode === '1288' ? '9' : '';
    const pattern = `${patternPrefix}${bank.accountPattern}`;
    return pattern;
  } catch (error) {
    console.error(error);
    return '';
  }
};

export const slugfyName = (name: string) => {
  return (
    name
      .toLowerCase()
      .replace(/[àÀáÁâÂãäÄÅåª]+/g, 'a') // Special Characters #1
      .replace(/[èÈéÉêÊëË]+/g, 'e') // Special Characters #2
      .replace(/[ìÌíÍîÎïÏ]+/g, 'i') // Special Characters #3
      .replace(/[òÒóÓôÔõÕöÖº]+/g, 'o') // Special Characters #4
      .replace(/[ùÙúÚûÛüÜ]+/g, 'u') // Special Characters #5
      .replace(/[ýÝÿŸ]+/g, 'y') // Special Characters #6
      .replace(/[ñÑ]+/g, 'n') // Special Characters #7
      .replace(/[çÇ]+/g, 'c') // Special Characters #8
      .replace(/[ß]+/g, 'ss') // Special Characters #9
      .replace(/[Ææ]+/g, 'ae') // Special Characters #10
      .replace(/[Øøœ]+/g, 'oe') // Special Characters #11
      .replace(/[%]+/g, 'pct') // Special Characters #12
      .replace(/\s+/g, '-') // Replace spaces with -
      // eslint-disable-next-line no-useless-escape
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      // eslint-disable-next-line no-useless-escape
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
  );
};

// phones

export const serializePhones = (phones: BusinessPhone[]) => {
  return phones.filter((phone) => phone.number !== '');
};

export const assertPhonesIsValid = (phones: BusinessPhone[]) => {
  if (!phones) return false;
  let n = 0;
  let result = true;
  while (phones.length > n && result === true) {
    if (phones[n].number.length < 10) result = false;
    n++;
  }
  return result;
};
