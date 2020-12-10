import { Box, FormLabel, Textarea as ChakraTextarea, TextareaProps } from '@chakra-ui/react';
import React from 'react';

interface Props extends TextareaProps {
  label?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, Props>(
  ({ label, mt, mb, ml, mr, flex, ...props }: Props, ref) => {
    const boxProps = { mt, mb, ml, mr, flex };
    return (
      <Box borderWidth="1px" borderRadius="md" pl="2" pt="1" {...boxProps}>
        {label && (
          <FormLabel htmlFor={props.id} textStyle="inputLabel" m="0">
            {label}
          </FormLabel>
        )}
        <ChakraTextarea ref={ref} variant="unstyled" pb="1" size="sm" {...props} />
      </Box>
    );
  }
);
