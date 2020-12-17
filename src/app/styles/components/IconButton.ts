export const IconButton = {
  // The styles all button have in common
  baseStyle: {
    border: '1px solid',
    borderRadius: 'lg',
    borderColor: 'gray.50',
  },
  // Variants
  variants: {
    outline: {
      'bg': 'white',
      'borderColor': 'gray.50',
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
    size: 'sm',
    variant: 'outline',
  },
};
