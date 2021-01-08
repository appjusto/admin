import {
  FormControl,
  FormLabel,
  Select as ChakraSelect,
  SelectProps,
  useMultiStyleConfig,
} from '@chakra-ui/react';
import React from 'react';
import { ReactComponent as SelectIcon } from './select-arrow.svg';

interface Props extends SelectProps {
  label?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, Props>(
  ({ label, mt, mb, ml, mr, flex, ...props }: Props, ref) => {
    const boxProps = { mt, mb, ml, mr, flex };
    const styles = useMultiStyleConfig('Select', {});
    return (
      <FormControl sx={styles.control} {...boxProps}>
        {label && (
          <FormLabel htmlFor={props.id} sx={styles.label} textStyle="inputLabel">
            {label}
          </FormLabel>
        )}
        <ChakraSelect ref={ref} size="md" sx={styles.select} icon={<SelectIcon />} {...props} />
      </FormControl>
    );
  }
);
