import {
  FormControl,
  FormLabel,
  Input,
  InputProps,
  useMultiStyleConfig,
} from '@chakra-ui/react';
import React, { ChangeEvent, useState } from 'react';

export interface CustomInputProps extends InputProps {
  id: string;
  label?: string;
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
      maxW,
      mt = '16px',
      mb,
      mr,
      ml,
      flex,
      isInvalid,
      ...props
    }: CustomInputProps,
    ref
  ) => {
    const [isInvalidIn, setIsInvalidIn] = useState(false);
    const styles = useMultiStyleConfig('CustomInput', {});
    const controlProps = { maxW, mt, mb, mr, ml, flex };
    const handleValidity = (ev: ChangeEvent<HTMLInputElement>) => {
      if (value !== '' && (!ev.target.validity.valid || isInvalid)) {
        setIsInvalidIn(true);
      } else {
        setIsInvalidIn(false);
      }
    };
    return (
      <FormControl id={id} sx={styles.control} {...controlProps}>
        {label && <FormLabel sx={styles.label}>{label}</FormLabel>}
        <Input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          sx={styles.input}
          onChange={handleChange}
          onBlur={handleValidity}
          errorBorderColor="red"
          isInvalid={isInvalidIn}
          {...props}
        />
      </FormControl>
    );
  }
);
