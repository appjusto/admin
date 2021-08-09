import i18n, { ToCurrencyOptions } from 'i18n-js';
import { round } from 'lodash';

// price and totals
export const formatCurrency = (value: number, options?: ToCurrencyOptions) =>
  i18n.toCurrency(value / 100, options);

// percentage
export const formatPct = (value: number) => `${parseFloat((value * 100).toFixed(2))}%`;

// date & time
export const formatDate = (date: Date, pattern: 'default' | 'monthYear' = 'default') =>
  i18n.l(`date.formats.${pattern}`, date);
export const formatTime = (date: Date) => i18n.l('time.formats.default', date);
export const getMonthName = (month: number) => i18n.strftime(new Date(2020, month, 1), '%B');

export const formatDuration = (duration: number) => {
  return `${round(duration / 60, 0)} min`;
};

// distance
export const formatDistance = (distance: number) => {
  if (distance < 1000) return `${distance}m`;
  return `${round(distance / 1000, 2)}km`;
};

export const slugify = (text: string, onBlur?: boolean) => {
  let slug = text.toString().toLowerCase();
  const sets = [
    { to: 'a', from: '[ÀÁÂÃÄÅÆĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶ]' },
    { to: 'c', from: '[ÇĆĈČ]' },
    { to: 'd', from: '[ÐĎĐÞ]' },
    { to: 'e', from: '[ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆ]' },
    { to: 'g', from: '[ĜĞĢǴ]' },
    { to: 'h', from: '[ĤḦ]' },
    { to: 'i', from: '[ÌÍÎÏĨĪĮİỈỊ]' },
    { to: 'j', from: '[Ĵ]' },
    { to: 'ij', from: '[Ĳ]' },
    { to: 'k', from: '[Ķ]' },
    { to: 'l', from: '[ĹĻĽŁ]' },
    { to: 'm', from: '[Ḿ]' },
    { to: 'n', from: '[ÑŃŅŇ]' },
    { to: 'o', from: '[ÒÓÔÕÖØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠ]' },
    { to: 'oe', from: '[Œ]' },
    { to: 'p', from: '[ṕ]' },
    { to: 'r', from: '[ŔŖŘ]' },
    { to: 's', from: '[ßŚŜŞŠ]' },
    { to: 't', from: '[ŢŤ]' },
    { to: 'u', from: '[ÙÚÛÜŨŪŬŮŰŲỤỦỨỪỬỮỰƯ]' },
    { to: 'w', from: '[ẂŴẀẄ]' },
    { to: 'x', from: '[ẍ]' },
    { to: 'y', from: '[ÝŶŸỲỴỶỸ]' },
    { to: 'z', from: '[ŹŻŽ]' },
  ];
  sets.forEach((set) => {
    slug = slug.replace(new RegExp(set.from, 'gi'), set.to);
  });
  slug = slug
    .replace(' ', '-') // Replace spaces with -
    .replace(/\--+/g, '-') // Replace multiple - with single -
    .replace(/[^\w\-]+/g, ''); // Remove all non-word chars

  if (onBlur) slug = slug.replace(/^-+/, '').replace(/-+$/, '');
  return slug;
};
