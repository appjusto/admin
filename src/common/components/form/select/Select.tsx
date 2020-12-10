import { Box, FormLabel, Select as ChakraSelect, SelectProps } from '@chakra-ui/react';
import React from 'react';
import { ReactComponent as SelectIcon } from './select-arrow.svg';

interface Props extends SelectProps {
  label?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, Props>(
  ({ label, mt, mb, ml, mr, flex, ...props }: Props, ref) => {
    const boxProps = { mt, mb, ml, mr, flex };
    return (
      <Box borderWidth="1px" borderRadius="md" pl="2" pt="1" {...boxProps}>
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
        />
      </Box>
    );
  }
);
