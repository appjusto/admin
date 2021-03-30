import { Alert, AlertDescription, AlertIcon, AlertProps, AlertTitle, Flex } from '@chakra-ui/react';

interface Props extends AlertProps {
  title: string;
  description: string;
  icon?: boolean;
  children?: React.ReactNode | React.ReactNode[];
}

export const AlertError = ({ title, description, icon = true, children, ...props }: Props) => (
  <Alert mt="4" status="error" color="black" bg="rgb(254, 215, 215)" borderRadius="lg" {...props}>
    {icon && <AlertIcon color="red" />}
    <Flex flexDir="column">
      <AlertTitle mr={2}>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
      {children}
    </Flex>
  </Alert>
);
