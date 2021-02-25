import { OrderItemComplement, OrderItem } from 'appjusto-types';
import { itemPriceFormatter, formatDate } from './formatters';
import { round } from 'lodash';
import { CroppedAreaProps } from 'common/components/ImageCropping';

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
