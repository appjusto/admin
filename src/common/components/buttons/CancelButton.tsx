import { ButtonProps, IconButton } from '@chakra-ui/react';
import React from 'react';
import { MdOutlineClose } from 'react-icons/md';

export const CancelButton = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <IconButton
    ref={ref}
    size="sm"
    borderColor="gray.50"
    aria-label="Edit product"
    variant="danger"
    icon={<MdOutlineClose />}
    {...props}
  />
));
