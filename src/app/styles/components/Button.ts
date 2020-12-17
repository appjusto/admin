export const Button = {
  // The styles all button have in common
  baseStyle: {
    fontWeight: 'medium',
    fontSize: 'sm',
    color: 'black',
    border: '1px solid',
    borderRadius: 'lg',
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
  },
  // The default size and variant values
  defaultProps: {
    size: 'md',
    variant: 'solid',
  },
};
