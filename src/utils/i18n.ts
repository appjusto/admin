import i18n from 'i18n-js';

const pt = {
  number: {
    currency: {
      format: {
        delimiter: '.',
        format: '%u %n',
        precision: 2,
        separator: ',',
        unit: 'R$',
        strip_insignificant_zeros: false,
      },
    },
  },
  date: {
    formats: {
      default: '%d/%m/%Y',
      monthYear: '%B, %-y',
    },
    day_names: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    abbr_day_names: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    month_names: [
      null,
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ],
    abbr_month_names: [
      null,
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ],
  },
  time: {
    formats: {
      default: '%Hh%M',
    },
  },
};

i18n.translations = { pt };
i18n.defaultLocale = 'pt';
i18n.locale = 'pt';
i18n.fallbacks = false;
i18n.missingTranslation = () => null; // removes missing translation message

export const t = (string: string) => i18n.t(string) || string;
