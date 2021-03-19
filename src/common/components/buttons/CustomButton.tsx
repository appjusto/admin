import { Button, ButtonProps, Link } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface Props extends ButtonProps {
  label: string;
  link?: string;
  isExternal?: boolean;
}

export const CustomButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ label, link, isExternal = false, ...props }, ref) => {
    if (link) {
      if (isExternal) {
        return (
          <Link href={link} isExternal>
            <Button ref={ref} mt="16px" display="block" {...props}>
              {label}
            </Button>
          </Link>
        );
      }
      return (
        <Link as={RouterLink} to={link}>
          <Button ref={ref} mt="16px" {...props}>
            {label}
          </Button>
        </Link>
      );
    }
    return (
      <Button ref={ref} width="100%" maxW="220px" h="60px" mt="16px" {...props}>
        {label}
      </Button>
    );
  }
);
