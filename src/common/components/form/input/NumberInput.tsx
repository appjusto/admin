import {
  Box,
  FormLabel,
  NumberInput as ChakraNumberInput,
  NumberInputField,
  NumberInputProps,
} from '@chakra-ui/react';
import React, { CSSProperties } from 'react';

interface Props extends NumberInputProps {
  label?: string;
  boxStyle?: CSSProperties;
}

export const NumberInput = React.forwardRef<HTMLInputElement, Props>(
  ({ label, mt, mb, ml, mr, flex, boxStyle, ...props }: Props, ref) => {
    const boxProps = { mt, mb, ml, mr, flex, boxStyle };
    return (
      <Box borderWidth="1px" borderRadius="md" pl="2" pt="1" {...boxProps}>
        {label && (
          <FormLabel htmlFor={props.id} textStyle="inputLabel" m="0">
            {label}
          </FormLabel>
        )}
        <ChakraNumberInput ref={ref} variant="unstyled" pb="1" size="sm" {...props}>
          <NumberInputField />
        </ChakraNumberInput>
      </Box>
    );
  }
);
