export const Button = {
  // The styles all button have in common
  baseStyle: {
    fontFamily: 'Barlow',
    fontWeight: 'medium',
    fontSize: 'sm',
    bg: 'green.500',
    color: 'black',
    border: '1px solid',
    borderRadius: 'lg',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    _focus: {
      boxShadow: 'none',
    },
    _hover: {
      _disabled: {
        bgColor: 'gray.500',
      },
    },
    _disabled: {
      opacity: 1,
      cursor: 'not-allowed',
      boxShadow: 'none',
      color: 'gray.600',
      bg: 'gray.500',
      border: 'none',
    },
  },
  // Variants
  variants: {
    solid: {
      bg: 'green.500',
      borderColor: 'green.500',
      _hover: {
        bg: 'green.300',
        borderColor: 'green.300',
      },
    },
    secondary: {
      bg: 'gray.700',
      borderColor: 'gray.700',
      color: 'white',
      fontSize: '15px',
      fontWeight: '500',
      _hover: {
        bg: 'gray.600',
        borderColor: 'gray.500',
      },
    },
    outline: {
      bg: 'white',
      borderColor: 'black',
      _hover: {
        bg: 'gray.50',
      },
    },
    outgreen: {
      bg: 'white',
      borderColor: 'green.600',
      color: 'green.600',
      _hover: {
        bg: 'green.50',
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
      bg: 'red',
      color: 'white',
      borderColor: 'red',
      _hover: {
        opacity: 0.9,
        _disabled: {
          opacity: 1,
        },
      },
    },
    dangerLight: {
      bg: 'white',
      color: 'red',
      borderColor: 'red',
      _hover: {
        bg: 'redLight',
      },
    },
    yellowDark: {
      bg: '#FFBE00',
      color: 'black',
      fontSize: '15px',
      fontWeight: '500',
      _hover: {
        backgroundColor: '#FFE493',
      },
    },
    black: {
      bg: '#000',
      color: 'white',
      fontSize: '15px',
      lineHeight: '21px',
      fontWeight: '700',
      _hover: {
        backgroundColor: 'gray.700',
      },
    },
  },
  // The default size and variant values
  defaultProps: {
    variant: 'solid',
    size: 'lg',
  },
};
