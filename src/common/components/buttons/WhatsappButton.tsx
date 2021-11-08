import { Button, ButtonProps, HStack, Icon, Link, Text } from '@chakra-ui/react';
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

interface Props extends ButtonProps {
  label: string;
  phone: string;
  align?: 'left' | 'right';
}

export const WhatsappButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ label, phone, align, ...props }, ref) => {
    return (
      <Link href={`https://wa.me/+55${phone}`} isExternal _hover={{ textDecor: 'none' }}>
        <Button ref={ref} display="block" variant="outgreen" {...props}>
          <HStack>
            <Text as="span">{label}</Text>
            <Icon as={FaWhatsapp} />
          </HStack>
        </Button>
      </Link>
    );
  }
);
