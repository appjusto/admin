import { Box, Flex } from '@chakra-ui/react';
import { useContextMeasurement } from 'app/state/measurement/context';
import Image from 'common/components/Image';
import leftImage from 'common/img/login-left@2x.jpg';
import rightImage from 'common/img/login-right@2x.jpg';
import React from 'react';
import { RegistrationForm } from './RegistrationForm';

const LandingPage = () => {
  // context
  const { handlePixelEvent } = useContextMeasurement();
  // side effects
  React.useEffect(() => {
    handlePixelEvent('pageView');
  }, [handlePixelEvent]);
  // UI
  return (
    <Flex w="100wh" h="100vh" justifyContent={{ sm: 'center' }}>
      <Box w={{ lg: 1 / 3 }} display={{ base: 'none', lg: 'block' }}>
        <Image src={leftImage} scrollCheck={false} w="100%" h="100vh" />
      </Box>
      <Flex
        position="relative"
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        w={{ base: '100%', md: '80%', lg: 1 / 3 }}
        px={{ base: '8', md: '24', lg: '8' }}
      >
        <RegistrationForm />
      </Flex>
      <Box w={{ lg: 1 / 3 }} display={{ base: 'none', lg: 'block' }}>
        <Image src={rightImage} scrollCheck={false} w="100%" h="100vh" />
      </Box>
    </Flex>
  );
};

export default LandingPage;
