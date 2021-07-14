import { Alert, AlertDescription, AlertIcon, AlertProps, AlertTitle, Flex } from '@chakra-ui/react';

interface Props extends AlertProps {
  title?: string;
  description?: string;
  icon?: boolean;
  children?: React.ReactNode | React.ReactNode[];
}

export const AlertError = ({ title, description, icon = false, children, ...props }: Props) => (
  <Alert
    mt="4"
    status="error"
    color="black"
    bg="rgb(254, 215, 215)"
    border="2px solid red"
    borderRadius="lg"
    {...props}
  >
    {icon && <AlertIcon color="red" />}
    <Flex flexDir="column">
      {title && <AlertTitle mr={2}>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
      {children}
    </Flex>
  </Alert>
);
