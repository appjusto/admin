import {
  Box,
  FormLabel,
  Input as ChakraInput,
  InputProps,
} from '@chakra-ui/react';
import React from 'react';

interface Props extends InputProps {
  label?: string;
}

export const Input = ({ label, ...props }: Props) => {
  return (
    <Box borderWidth="1px" borderRadius="md" pl="2" pt="1">
      {label && (
        <FormLabel htmlFor={props.id} textStyle="inputLabel" m="0">
          {label}
        </FormLabel>
      )}
      <ChakraInput variant="unstyled" pb="1" size="sm" {...props}></ChakraInput>
    </Box>
  );
};
