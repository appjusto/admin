import { checkboxAnatomy as parts } from '@chakra-ui/anatomy';
import type {
  PartsStyleFunction,
  PartsStyleObject,
  SystemStyleFunction,
  SystemStyleObject,
} from '@chakra-ui/theme-tools';
import { mode } from '@chakra-ui/theme-tools';

const baseStyleControl: SystemStyleFunction = (props) => {
  const { colorScheme: c } = props;

  return {
    w: '100%',
    transitionProperty: 'box-shadow',
    transitionDuration: 'normal',
    border: '2px solid',
    borderColor: 'black',
    borderRadius: '4px',
    color: 'white',

    _checked: {
      bg: `radialGradient(circle, ${`${c}.500`} 60%, ${`${c}.500`} 30%, white 10%)`,
      color: mode(`${c}.500`, `${c}.200`)(props),
      borderColor: 'black',
      _before: {
        content: `""`,
        display: 'block',
        pos: 'absolute',
        w: '16px',
        h: '16px',
        borderRadius: '4px',
        bg: 'currentColor',
      },

      _disabled: {
        borderColor: mode('gray.200', 'transparent')(props),
        bg: mode('gray.200', 'whiteAlpha.300')(props),
        color: mode('gray.500', 'whiteAlpha.500')(props),
      },
    },

    _indeterminate: {
      bg: mode(`${c}.500`, `${c}.200`)(props),
      borderColor: mode(`${c}.500`, `${c}.200`)(props),
      color: mode('white', 'gray.900')(props),
    },

    _disabled: {
      bg: mode('gray.100', 'whiteAlpha.100')(props),
      borderColor: mode('gray.100', 'transparent')(props),
    },

    _focus: {
      boxShadow: 'none',
    },

    _invalid: {
      borderColor: mode('red.500', 'red.300')(props),
    },
  };
};

const baseStyleLabel: SystemStyleObject = {
  userSelect: 'none',
  _disabled: { opacity: 0.4 },
};

const baseStyle: PartsStyleFunction<typeof parts> = (props) => ({
  control: baseStyleControl(props),
  label: baseStyleLabel,
});

const sizes: Record<string, PartsStyleObject<typeof parts>> = {
  sm: {
    control: { h: 4, w: 4 },
    label: { fontSize: 'sm' },
    icon: { fontSize: '0' },
  },
  md: {
    control: { w: 6, h: 6 },
    label: { fontSize: 'md' },
    icon: { fontSize: '0' },
  },
  lg: {
    control: { w: 7, h: 7 },
    label: { fontSize: 'lg' },
    icon: { fontSize: '0' },
  },
};

const defaultProps = {
  size: 'md',
  colorScheme: 'green',
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  parts: parts.keys,
  baseStyle,
  sizes,
  defaultProps,
};
