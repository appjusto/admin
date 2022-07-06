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
    _loading: { 
      opacity: 1,
      _hover: {
        color: 'grey'
      } 
    }
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
      'fontSize': '15px',
      'fontWeight': '500',
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
    outgreen: {
      'bg': 'white',
      'borderColor': 'green.600',
      'color': 'green.600',
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
    yellowDark: {
      'bg': '#FFBE00',
      'color': 'black',
      'fontSize': '15px',
      'fontWeight': '500',
      ':hover': {
        backgroundColor: '#FFE493',
      },
      ':disabled': {
        color: 'gray.700',
        borderColor: 'gray.500',
        backgroundColor: 'gray.200',
      },
    },
    black: {
      'bg': '#000',
      'color': 'white',
      'fontSize': '15px',
      'lineHeight': '21px',
      'fontWeight': '700',
      ':hover': {
        backgroundColor: 'gray.700',
      },
      ':disabled': {
        color: 'gray.700',
        borderColor: 'gray.500',
        backgroundColor: 'gray.200',
      },
    },
  },
  // The default size and variant values
  defaultProps: {
    variant: 'solid',
    size: 'lg',
  },
};
