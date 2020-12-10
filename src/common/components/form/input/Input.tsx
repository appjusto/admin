import { Input as ChakraInput, InputProps } from '@chakra-ui/react';
import React from 'react';
import { LabeledControl } from '../LabeledControl';

interface Props extends InputProps {
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ label, ...props }: Props, ref) => {
    return (
      <LabeledControl label={label} {...props}>
        {(inputProps) => <ChakraInput ref={ref} {...inputProps} />}
      </LabeledControl>
    );
  }
);
