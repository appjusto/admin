import { FormControl, FormLabel, Input, InputProps, useMultiStyleConfig } from '@chakra-ui/react';
import React, { ChangeEvent, useState } from 'react';

export interface CustomInputProps extends InputProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  type?: string;
  mr?: string | number | (string & {}) | undefined;
  handleChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      id,
      label,
      placeholder = '',
      value,
      type = 'text',
      mr = 0,
      handleChange = () => {},
      ...props
    }: CustomInputProps,
    ref
  ) => {
    const [isInvalid, setIsInvalid] = useState(false);
    const styles = useMultiStyleConfig('CustomInput', {});
    const handleValidity = (ev: ChangeEvent<HTMLInputElement>) => {
      if (value !== '' && !ev.target.validity.valid) {
        setIsInvalid(true);
      } else {
        setIsInvalid(false);
      }
    };
    return (
      <FormControl id={id} sx={styles.control} mr={mr}>
        <FormLabel sx={styles.label}>{label}</FormLabel>
        <Input
          ref={ref}
          isInvalid={isInvalid}
          isRequired
          type={type}
          placeholder={placeholder}
          value={value}
          sx={styles.input}
          onChange={handleChange}
          onBlur={handleValidity}
          errorBorderColor="red"
          {...props}
        />
      </FormControl>
    );
  }
);
