import { Container, ContainerProps } from '@chakra-ui/react';

const OnbContainer = ({ children, ...props }: ContainerProps) => {
  return (
    <Container maxW={{ base: '100%', md: '740px', lg: '1120px' }} pt="10" {...props}>
      {children}
    </Container>
  );
};

export default OnbContainer;
