import { Alert, AlertDescription, AlertIcon, AlertProps, AlertTitle, Flex } from '@chakra-ui/react';

interface Props extends AlertProps {
  title: string;
  description: string;
}

export const AlertError = ({ title, description, ...props }: Props) => (
  <Alert mt="4" status="error" color="black" bg="rgb(254, 215, 215)" borderRadius="lg" {...props}>
    <AlertIcon color="red" />
    <Flex flexDir="column">
      <AlertTitle mr={2}>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Flex>
  </Alert>
);
