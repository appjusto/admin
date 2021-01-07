import { FormControl, FormLabel, Input, InputProps, useMultiStyleConfig } from '@chakra-ui/react';
import { ChangeEvent } from 'react';

interface CustomInputProps extends InputProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  type?: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  id,
  label,
  placeholder,
  value,
  type = 'text',
  handleChange,
  ...props
}) => {
  const styles = useMultiStyleConfig('CustomInput', {});
  return (
    <FormControl id={id} mt="24px" mr={['0', null, null, '16px']}>
      <FormLabel sx={styles.label}>{label}</FormLabel>
      <Input
        isRequired
        type={type}
        placeholder={placeholder}
        value={value}
        sx={styles.input}
        onChange={handleChange}
        autoComplete="off"
        {...props}
      />
    </FormControl>
  );
};
