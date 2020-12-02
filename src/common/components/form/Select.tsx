import { Box, FormLabel, Select as ChakraSelect, SelectProps } from '@chakra-ui/react';
import React from 'react';
import { ReactComponent as SelectIcon } from './select-arrow.svg';

interface Props extends SelectProps {
  label?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, Props>(
  ({ label, ...props }: Props, ref) => {
    return (
      <Box borderWidth="1px" borderRadius="md" pl="2" pt="1">
        {label && (
          <FormLabel htmlFor={props.id} textStyle="inputLabel" m="0">
            {label}
          </FormLabel>
        )}
        <ChakraSelect
          ref={ref}
          variant="unstyled"
          pb="1"
          size="md"
          icon={<SelectIcon />}
          {...props}
        ></ChakraSelect>
      </Box>
    );
  }
);
