import { FormControl, FormLabel, Input, InputProps, useMultiStyleConfig } from '@chakra-ui/react';
import React from 'react';

interface PatternInputProps extends InputProps {
  id: string;
  label: string;
  mask?: string;
  flex?: number | undefined;
  mr?: string | number | (string & {}) | undefined;
  validationLength?: number;
  externalValidation?: { active: boolean; status: boolean };
  parser?: (value: string) => string;
  formatter?: (value: string | undefined) => string;
  onValueChange: (value: string) => void;
  notifyParentWithValidation?: (isInvalid: boolean) => void;
}

export const CustomPatternInput = React.forwardRef<HTMLInputElement, PatternInputProps>(
  (
    {
      id,
      label,
      mask,
      value,
      placeholder: unfocusedPlaceholder,
      mt = '16px',
      mb,
      mr,
      ml,
      flex,
      validationLength,
      externalValidation,
      parser,
      formatter,
      onValueChange,
      onChange,
      onBlur,
      onFocus,
      notifyParentWithValidation,
      ...props
    }: PatternInputProps,
    ref
  ) => {
    // props
    const controlProps = { mt, mb, mr, ml, flex };
    const formattedValue = value ? (formatter ? formatter(String(value)) : value) : value;
    // state
    const [placeholder, setPlaceholder] = React.useState(unfocusedPlaceholder);
    const [isInvalid, setIsInvalid] = React.useState(false);
    // handlers
    const onChangeHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
      const value = ev.target.value;
      onValueChange(parser ? parser(value) : value);
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
    // side effects
    React.useEffect(() => {
      if (value && value.toString().length > 0) {
        if (validationLength) {
          if (value.toString().length < validationLength) {
            setIsInvalid(true);
          } else {
            setIsInvalid(false);
          }
        }
        if (externalValidation?.active) {
          setIsInvalid(!externalValidation.status);
        }
      } else setIsInvalid(false);
    }, [value, validationLength, externalValidation]);

    React.useEffect(() => {
      if (notifyParentWithValidation) notifyParentWithValidation(isInvalid);
    }, [isInvalid]);

    // UI
    const styles = useMultiStyleConfig('CustomInput', {});
    return (
      <FormControl id={id} sx={styles.control} {...controlProps}>
        <FormLabel sx={styles.label}>{label}</FormLabel>
        <Input
          ref={ref}
          isInvalid={isInvalid}
          sx={styles.input}
          value={formattedValue}
          placeholder={placeholder}
          onChange={onChangeHandler}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          maxLength={mask ? mask.length : undefined}
          errorBorderColor="red"
          {...props}
        />
      </FormControl>
    );
  }
);
