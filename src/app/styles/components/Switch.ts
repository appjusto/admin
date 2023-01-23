import { switchAnatomy as parts } from '@chakra-ui/anatomy';
import type {
  PartsStyleFunction,
  PartsStyleObject,
  SystemStyleFunction,
} from '@chakra-ui/theme-tools';
import { calc, cssVar } from '@chakra-ui/theme-tools';

const $width = cssVar('switch-track-width');
const $height = cssVar('switch-track-height');

const $diff = cssVar('switch-track-diff');
const diffValue = calc.subtract($width, $height);

const $translateX = cssVar('switch-thumb-x');

const baseStyleTrack: SystemStyleFunction = (props) => {
  return {
    bg: 'white',
    border: '2px solid black',
    borderRadius: 'full',
    p: '2px',
    width: [$width.reference],
    height: [$height.reference],
    transitionProperty: 'common',
    transitionDuration: 'fast',
    _focus: {
      boxShadow: 'none',
    },
    _disabled: {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
  };
};

const baseStyleThumb = {
  bg: '#ffe493',
  border: '2px solid black',
  transitionProperty: 'transform',
  transitionDuration: 'normal',
  borderRadius: 'inherit',
  width: [$height.reference],
  height: [$height.reference],
  _checked: {
    transform: `translateX(${$translateX.reference})`,
    bg: '#78e08f',
  },
};

const baseStyle: PartsStyleFunction<typeof parts> = (props) => ({
  container: {
    [$diff.variable]: diffValue,
    [$translateX.variable]: $diff.reference,
    _rtl: {
      [$translateX.variable]: calc($diff).negate().toString(),
    },
  },
  track: baseStyleTrack(props),
  thumb: baseStyleThumb,
});

const sizes: Record<string, PartsStyleObject<typeof parts>> = {
  sm: {
    container: {
      [$width.variable]: '1.375rem',
      [$height.variable]: '0.75rem',
    },
  },
  md: {
    container: {
      [$width.variable]: '1.875rem',
      [$height.variable]: '1rem',
    },
  },
  lg: {
    container: {
      [$width.variable]: '2.875rem',
      [$height.variable]: '1.5rem',
    },
  },
};

const defaultProps = {
  size: 'lg',
  colorScheme: 'white',
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  parts: parts.keys,
  baseStyle,
  sizes,
  defaultProps,
};
