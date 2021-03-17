import { Alert, AlertDescription, AlertIcon, AlertProps, AlertTitle, Flex } from '@chakra-ui/react';

interface Props extends AlertProps {
  title: string;
  description: string;
  hasIcon?: boolean;
  children?: React.ReactNode | React.ReactNode[];
}

export const AlertWarning = ({ title, description, hasIcon = true, children, ...props }: Props) => (
  <Alert
    mt="4"
    status="warning"
    color="black"
    border="1px solid #FFBE00"
    borderRadius="lg"
    {...props}
  >
    {hasIcon && <AlertIcon />}
    <Flex flexDir="column">
      <AlertTitle mr={2}>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
      {children}
    </Flex>
  </Alert>
);
