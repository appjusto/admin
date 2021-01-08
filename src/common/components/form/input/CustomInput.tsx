import { FormControl, FormLabel, Input, InputProps, useMultiStyleConfig } from '@chakra-ui/react';
import React, { ChangeEvent, useState } from 'react';

export interface CustomInputProps extends InputProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  type?: string;
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
      handleChange = () => {},
      mt,
      mb,
      mr,
      ml,
      flex,
      ...props
    }: CustomInputProps,
    ref
  ) => {
    const [isInvalid, setIsInvalid] = useState(false);
    const styles = useMultiStyleConfig('CustomInput', {});
    const controlProps = { mt, mb, mr, ml, flex };
    const handleValidity = (ev: ChangeEvent<HTMLInputElement>) => {
      if (value !== '' && !ev.target.validity.valid) {
        setIsInvalid(true);
      } else {
        setIsInvalid(false);
      }
    };
    return (
      <FormControl id={id} sx={styles.control} {...controlProps}>
        <FormLabel sx={styles.label}>{label}</FormLabel>
        <Input
          ref={ref}
          isInvalid={isInvalid}
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
