import {
  FormControl,
  FormLabel,
  Input,
  InputProps,
  useMultiStyleConfig,
} from '@chakra-ui/react';
import React from 'react';
import { formattedRawValue, getRawValue } from './utils';

interface CurrencyInputProps extends InputProps {
  id: string;
  label?: string;
  value: number;
  onChangeValue: (value: number) => void;
  maxLength?: number;
}

export const CurrencyInput = React.forwardRef<
  HTMLInputElement,
  CurrencyInputProps
>(
  (
    {
      id,
      mt = '16px',
      mb,
      mr,
      ml,
      flex,
      value,
      label,
      onChangeValue: onValueChange,
      maxLength,
      isInvalid,
      ...props
    }: CurrencyInputProps,
    ref
  ) => {
    //props
    const controlProps = { mt, mb, mr, ml, flex };
    // state
    const [priceText, setPriceText] = React.useState('');
    // side effects
    React.useLayoutEffect(() => {
      // keep internal state in sync with value received
      // and format value from number to string
      const parentRawValue = value.toString();
      setPriceText(parentRawValue);
    }, [value]);
    //handler
    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
      if (maxLength) {
        if (ev.target.value.length > maxLength + 4) {
          return;
        }
      }
      const newValue = getRawValue(ev.target.value);
      const intValue = parseInt(newValue);
      onValueChange(intValue);
    };
    // UI
    const styles = useMultiStyleConfig('CustomInput', {});
    return (
      <FormControl id={id} sx={styles.control} {...controlProps}>
        {label && <FormLabel sx={styles.label}>{label}</FormLabel>}
        <Input
          ref={ref}
          value={formattedRawValue(priceText)}
          onChange={handleChange}
          isInvalid={isInvalid}
          errorBorderColor="red"
          sx={styles.input}
          {...props}
        />
      </FormControl>
    );
  }
);
