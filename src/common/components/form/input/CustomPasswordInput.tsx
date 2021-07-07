import {
  Center,
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputProps,
  useMultiStyleConfig,
} from '@chakra-ui/react';
import React, { ChangeEvent } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

export interface CustomPasswordInputProps extends InputProps {
  id: string;
  label?: string;
  placeholder?: string;
  value: string;
  handleChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  getValidity?(isValid: boolean): void;
}

export const CustomPasswordInput = React.forwardRef<HTMLInputElement, CustomPasswordInputProps>(
  (
    {
      id,
      label,
      placeholder = '',
      value,
      handleChange = () => {},
      getValidity,
      maxW,
      mt = '16px',
      mb,
      mr,
      ml,
      flex,
      ...props
    }: CustomPasswordInputProps,
    ref
  ) => {
    // state
    const [isVisible, setIsvisible] = React.useState(false);
    const [isInvalid, setIsInvalid] = React.useState(false);
    // handlers
    const handleValidity = () => {
      const isValid = /^(?=.*\d)(?=.*[A-Z]).{8,}$/.test(value);
      setIsInvalid(!isValid);
      if (getValidity) getValidity(isValid);
    };
    // UI
    const styles = useMultiStyleConfig('CustomInput', {});
    const controlProps = { maxW, mt, mb, mr, ml, flex };
    /*const handleValidity = (ev: ChangeEvent<HTMLInputElement>) => {
      if (value !== '' && !ev.target.validity.valid) {
        setIsInvalid(true);
      } else {
        setIsInvalid(false);
      }
    };*/
    return (
      <FormControl id={id} sx={styles.control} {...controlProps}>
        {label && <FormLabel sx={styles.label}>{label}</FormLabel>}
        <Input
          ref={ref}
          isInvalid={isInvalid}
          type={isVisible ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          sx={styles.input}
          onChange={handleChange}
          onBlur={handleValidity}
          errorBorderColor="red"
          {...props}
        />
        <Center
          pos="absolute"
          top="22px"
          right="3"
          onClick={() => setIsvisible((prev) => !prev)}
          cursor="pointer"
          zIndex="9999"
        >
          {isVisible ? (
            <Icon as={MdVisibility} w="20px" h="20px" />
          ) : (
            <Icon as={MdVisibilityOff} w="20px" h="20px" />
          )}
        </Center>
      </FormControl>
    );
  }
);
