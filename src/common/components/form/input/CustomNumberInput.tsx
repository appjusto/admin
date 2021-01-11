import { FormControl, FormLabel, Input, InputProps, useMultiStyleConfig } from '@chakra-ui/react';
import React from 'react';
import { numbersOnlyParser } from './pattern-input/parsers';

interface Props extends InputProps {
  id: string;
  label?: string;
  value: string;
  maxLength?: number;
}

export const CustomNumberInput = React.forwardRef<HTMLInputElement, Props>(
  ({ id, label, value, maxLength, mt, mb, ml, mr, flex, ...props }: Props, ref) => {
    const [state, setState] = React.useState('');
    const controlProps = { mt, mb, ml, mr, flex };
    const styles = useMultiStyleConfig('CustomInput', {});
    React.useLayoutEffect(() => {
      const newState = numbersOnlyParser(value);
      setState((prevState) => {
        if (maxLength && newState.length < maxLength) {
          return newState;
        } else if (maxLength && prevState.length === maxLength) {
          return prevState;
        } else {
          return newState;
        }
      });
    }, [value, maxLength]);
    return (
      <FormControl id={id} sx={styles.control} {...controlProps}>
        {label && <FormLabel sx={styles.label}>{label}</FormLabel>}
        <Input ref={ref} value={state} sx={styles.input} {...props} />
      </FormControl>
    );
  }
);
