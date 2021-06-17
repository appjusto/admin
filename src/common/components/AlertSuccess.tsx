import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertProps,
  AlertTitle,
  Flex,
  Text,
} from '@chakra-ui/react';

interface Props extends AlertProps {
  title: string;
  description?: string;
  icon?: boolean;
  children?: React.ReactNode | React.ReactNode[];
}

export const AlertSuccess = ({ title, description, icon = true, children, ...props }: Props) => (
  <Alert
    mt="4"
    status="success"
    color="black"
    border="1px solid green"
    borderRadius="lg"
    {...props}
  >
    {icon && <AlertIcon />}
    <Flex flexDir="column">
      <AlertTitle mr={2}>{<Text as="span">{title}</Text>}</AlertTitle>
      {description && <AlertDescription>{<Text as="span">{description}</Text>}</AlertDescription>}
    </Flex>
  </Alert>
);
