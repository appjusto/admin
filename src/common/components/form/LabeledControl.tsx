import { Box, BoxProps, FormLabel } from '@chakra-ui/react';
import React from 'react';

interface Props extends BoxProps {
  label?: string;
  children: (props: any) => React.ReactNode | React.ReactNode[];
}

export const LabeledControl = ({
  label,
  id,
  mt,
  mb,
  ml,
  mr,
  flex,
  flexGrow,
  children,
  ...props
}: Props) => {
  const boxProps = { mt, mb, ml, mr, flex, flexGrow };
  return (
    <Box borderWidth="1px" borderRadius="md" pl="2" pt="1" {...boxProps}>
      {label && (
        <FormLabel htmlFor={id} textStyle="inputLabel" m="0">
          {label}
        </FormLabel>
      )}
      {children({
        id,
        padding: '0px',
        pb: '1',
        size: 'sm',
        borderWidth: '0px',
        focusBorderColor: '0px',
        ...props,
      })}
    </Box>
  );
};
