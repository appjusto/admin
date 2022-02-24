import { ButtonProps, IconButton } from '@chakra-ui/react';
import React from 'react';
import { GrClone } from 'react-icons/gr';

export const DuplicateButton = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <IconButton
    ref={ref}
    size="sm"
    borderColor="gray.50"
    ml="4"
    aria-label="Edit product"
    variant="outline"
    icon={<GrClone />}
    {...props}
  />
));
