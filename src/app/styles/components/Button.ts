export const Button = {
  // The styles all button have in common
  baseStyle: {
    fontFamily: 'Barlow',
    fontWeight: 'medium',
    fontSize: 'sm',
    color: 'black',
    border: '1px solid',
    borderRadius: 'lg',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
  },
  // Variants
  variants: {
    solid: {
      'bg': 'green.500',
      'borderColor': 'green.500',
      ':hover': {
        bg: 'green.300',
        borderColor: 'green.300',
      },
      ':disabled': {
        bg: 'gray.700',
        borderColor: 'gray.700',
        color: 'white',
      },
    },
    secondary: {
      'bg': 'gray.700',
      'borderColor': 'gray.700',
      'color': 'white',
      ':hover': {
        bg: 'gray.500',
        borderColor: 'gray.500',
      },
      ':disabled': {
        bg: 'gray.300',
        borderColor: 'gray.300',
      },
    },
    outline: {
      'bg': 'white',
      'borderColor': 'black',
      ':hover': {
        color: 'gray.700',
        borderColor: 'gray.700',
      },
      ':disabled': {
        color: 'gray.500',
        borderColor: 'gray.500',
      },
    },
    white: {
      'bg': 'white',
      'color': 'black',
      'borderColor': 'black',
      ':hover': {
        color: 'gray.700',
      },
      ':disabled': {
        color: 'gray.500',
        borderColor: 'gray.500',
      },
    },
    registration: {
      border: '2px solid black',
      bg: '#FFE493',
      h: '60px',
      fontSize: '20px',
      lineHeight: '26px',
      fontWeight: '700',
      _hover: { bg: '#FFC093' },
    },
    danger: {
      'bg': 'red',
      'color': 'white',
      'borderColor': 'red',
      ':hover': {
        color: 'gray.700',
        borderColor: 'gray.700',
      },
      ':disabled': {
        color: 'gray.500',
        borderColor: 'gray.500',
      },
    },
    dangerLight: {
      'bg': 'white',
      'color': 'red',
      'borderColor': 'red',
      ':hover': {
        color: 'gray.700',
        borderColor: 'gray.700',
      },
      ':disabled': {
        color: 'gray.500',
        borderColor: 'gray.500',
      },
    },
  },
  // The default size and variant values
  defaultProps: {
    variant: 'solid',
    size: 'lg',
  },
};
