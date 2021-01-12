export const CustomTextarea = {
  parts: ['control', 'label', 'input'],
  baseStyle: {
    control: {
      position: 'relative',
      zIndex: '1',
    },
    label: {
      position: 'absolute',
      fontFamily: 'Barlow',
      fontSize: '13px',
      color: 'green.600',
      top: '8px',
      left: '16px',
      zIndex: '1000',
    },
    input: {
      fontFamily: 'Barlow',
      width: '100%',
      fontSize: '16px',
      height: '150px',
      color: '#697667',
      borderColor: '#C8D7CB',
      pt: '30px',
      pb: '9px',
      zIndex: '1',
    },
  },
};
