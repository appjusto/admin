import { Button, ButtonProps } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

interface Props extends ButtonProps {
  label: string;
  link?: string;
}

export const CustomButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ label, link, ...props }, ref) => {
    if (link) {
      return (
        <Link to={link}>
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
