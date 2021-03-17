import { Alert, AlertDescription, AlertIcon, AlertProps, AlertTitle, Flex } from '@chakra-ui/react';

interface Props extends AlertProps {
  title: string;
  description: string;
  children?: React.ReactNode | React.ReactNode[];
}

export const AlertWarning = ({ title, description, children, ...props }: Props) => (
  <Alert
    mt="4"
    status="warning"
    color="black"
    border="1px solid #FFBE00"
    borderRadius="lg"
    {...props}
  >
    <AlertIcon />
    <Flex flexDir="column">
      <AlertTitle mr={2}>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
      {children}
    </Flex>
  </Alert>
);
