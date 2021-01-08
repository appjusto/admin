import { FormControl, FormLabel, Input, InputProps, useMultiStyleConfig } from '@chakra-ui/react';
import React from 'react';

interface PatternInputProps extends InputProps {
  id: string;
  label: string;
  mask?: string;
  flex?: number | undefined;
  mr?: string | number | (string & {}) | undefined;
  parser: (value: string) => string;
  formatter?: (value: string | undefined) => string;
  onValueChange: (value: string) => void;
}

export const CustomPatternInput = React.forwardRef<HTMLInputElement, PatternInputProps>(
  (
    {
      id,
      label,
      mask,
      value,
      placeholder: unfocusedPlaceholder,
      flex,
      mr,
      parser,
      formatter,
      onValueChange,
      onChange,
      onBlur,
      onFocus,
      ...props
    }: PatternInputProps,
    ref
  ) => {
    // state
    const [placeholder, setPlaceholder] = React.useState(unfocusedPlaceholder);
    const formattedValue = value ? (formatter ? formatter(String(value)) : value) : value;
    // handlers
    const onChangeHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
      const value = ev.target.value;
      onValueChange(parser(value));
      if (onChange) onChange(ev);
    };
    const onFocusHandler = (ev: React.FocusEvent<HTMLInputElement>) => {
      if (mask) setPlaceholder(mask);
      if (onFocus) onFocus(ev);
    };
    const onBlurHandler = (ev: React.FocusEvent<HTMLInputElement>) => {
      setPlaceholder(unfocusedPlaceholder);
      if (onBlur) onBlur(ev);
    };
    // UI
    const styles = useMultiStyleConfig('CustomInput', {});
    return (
      <FormControl id={id} sx={styles.control} flex={flex ? flex : undefined} mr={mr}>
        <FormLabel sx={styles.label}>{label}</FormLabel>
        <Input
          ref={ref}
          sx={styles.input}
          value={formattedValue}
          placeholder={placeholder}
          onChange={onChangeHandler}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          maxLength={mask ? mask.length : undefined}
          {...props}
        />
      </FormControl>
    );
  }
);
