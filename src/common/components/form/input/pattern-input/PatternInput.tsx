import React from 'react';
import { Input, InputProps } from '../Input';

interface PatternInputProps extends InputProps {
  parser: (value: string) => string;
  formatter?: (value: string | undefined) => string;
  onValueChange: (value: string) => void;
  mask?: string;
}

export const PatternInput = React.forwardRef<HTMLInputElement, PatternInputProps>(
  (
    {
      value,
      placeholder: unfocusedPlaceholder,
      mask,
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
    return (
      <Input
        ref={ref}
        value={formattedValue}
        placeholder={placeholder}
        onChange={onChangeHandler}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
        maxLength={mask ? mask.length : undefined}
        {...props}
      />
    );
  }
);
