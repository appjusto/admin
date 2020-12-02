import { Box, FormLabel, Textarea as ChakraTextarea, TextareaProps } from '@chakra-ui/react';
import React from 'react';

interface Props extends TextareaProps {
  label?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, Props>(
  ({ label, ...props }: Props, ref) => {
    return (
      <Box borderWidth="1px" borderRadius="md" pl="2" pt="1">
        {label && (
          <FormLabel htmlFor={props.id} textStyle="inputLabel" m="0">
            {label}
          </FormLabel>
        )}
        <ChakraTextarea ref={ref} variant="unstyled" pb="1" size="sm" {...props}></ChakraTextarea>
      </Box>
    );
  }
);
