import { Button, ButtonProps } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

interface Props extends ButtonProps {
  label: string;
  link?: string;
}

export const CustomButton = ({ label, link, ...props }: Props) => {
  if (link) {
    return (
      <Link to={link}>
        <Button mt="16px" {...props}>
          {label}
        </Button>
      </Link>
    );
  }
  return (
    <Button width="100%" maxW="220px" h="60px" mt="16px" {...props}>
      {label}
    </Button>
  );
};
