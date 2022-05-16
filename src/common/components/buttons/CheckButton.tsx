import { ButtonProps, IconButton } from '@chakra-ui/react';
import React from 'react';
import { FaCheck } from 'react-icons/fa';

export const CheckButton = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <IconButton
    ref={ref}
    size="sm"
    borderColor="gray.50"
    aria-label="Edit product"
    // variant="outline"
    icon={<FaCheck />}
    {...props}
  />
));
