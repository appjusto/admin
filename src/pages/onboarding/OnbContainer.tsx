import { Container, ContainerProps } from '@chakra-ui/react';

const OnbContainer = ({ children, ...props }: ContainerProps) => {
  return (
    <Container maxW={{ base: '100%', md: '700px', lg: '968px' }} pt="10" {...props}>
      {children}
    </Container>
  );
};

export default OnbContainer;
