import { ButtonProps, IconButton } from '@chakra-ui/react';
import { ReactComponent as EditIcon } from 'common/img/edit-icon.svg';
import React from 'react';

export const EditButton = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <IconButton
    ref={ref}
    size="sm"
    borderColor="gray.50"
    ml="4"
    aria-label="Edit product"
    variant="outline"
    icon={<EditIcon />}
    {...props}
  />
));
