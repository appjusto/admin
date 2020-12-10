import { Input as ChakraInput, InputProps as ChakraInputProps } from '@chakra-ui/react';
import React from 'react';
import { LabeledControl } from '../LabeledControl';

export interface InputProps extends ChakraInputProps {
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, ...props }: InputProps, ref) => {
    return (
      <LabeledControl label={label} {...props}>
        {(inputProps) => <ChakraInput ref={ref} {...inputProps} />}
      </LabeledControl>
    );
  }
);
