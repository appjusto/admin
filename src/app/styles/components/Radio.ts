import { radioAnatomy as parts } from '@chakra-ui/anatomy';
import {
  PartsStyleFunction,
  PartsStyleObject,
  SystemStyleFunction,
} from '@chakra-ui/theme-tools';
import Checkbox from './Checkbox';

const baseStyleControl: SystemStyleFunction = (props) => {
  const { control = {} } = Checkbox.baseStyle(props);

  return {
    ...control,
    borderRadius: 'full',
    _checked: {
      // @ts-ignore
      ...control['_checked'],
      _before: {
        content: `""`,
        display: 'inline-block',
        pos: 'relative',
        w: '75%',
        h: '75%',
        borderRadius: '50%',
        bg: 'currentColor',
      },
    },
    _disabled: {
      cursor: 'not-allowed',
    },
  };
};

const baseStyle: PartsStyleFunction<typeof parts> = (props) => ({
  label: Checkbox.baseStyle(props).label,
  control: baseStyleControl(props),
});

const sizes: Record<string, PartsStyleObject<typeof parts>> = {
  sm: {
    control: { width: 4, height: 4 },
    label: { fontSize: 'sm' },
  },
  md: {
    control: { w: 6, h: 6 },
    label: { fontSize: 'md' },
  },
  lg: {
    control: { w: 7, h: 7 },
    label: { fontSize: 'lg' },
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
