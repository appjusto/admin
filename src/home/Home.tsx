import { Box, Button, Center, Flex, FormControl, Text } from '@chakra-ui/react';
import React from 'react';
import { ReactComponent as Logo } from 'common/img/logo.svg';
import { Input } from 'common/components/Input';

const HomeLeftImage = React.lazy(
  () => import(/* webpackPrefetch: true */ './img/HomeLeftImage')
);
const HomeRightImage = React.lazy(
  () => import(/* webpackPrefetch: true */ './img/HomeRightImage')
);

export const Home = () => {
  return (
    <Flex>
      <Box w={[0, 1 / 3]} display={['none', 'revert']}>
        <React.Suspense fallback={null}>
          <HomeLeftImage />
        </React.Suspense>
      </Box>
      <Center w={['100%', 1 / 3]}>
        <Box width="full" p="16">
          <Logo />
          <Box mt="8">
            <Text fontSize="xl">Portal do Parceiro</Text>
            <Text fontSize="md" color="gray.500">
              Gerencie seu estabelecimento
            </Text>
            <Box mt="4">
              <FormControl isRequired>
                <Input
                  id="email"
                  label="E-mail"
                  placeholder="Endereço de e-mail"
                />
              </FormControl>
            </Box>
            <Button width="full" mt="6">
              Entrar
            </Button>
          </Box>
        </Box>
      </Center>
      <Box w={[0, 1 / 3]} display={['none', 'revert']}>
        <React.Suspense fallback={null}>
          <HomeRightImage />
        </React.Suspense>
      </Box>
    </Flex>
  );
};
