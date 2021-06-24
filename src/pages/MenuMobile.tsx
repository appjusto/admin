import {
  Box,
  Button,
  CloseButton,
  Collapse,
  Flex,
  HStack,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import Container from 'common/components/Container';
import Image from 'common/components/Image';
import logo from 'common/img/logo.svg';
import { Links } from 'pages/sidebar/Links';
import { ManagerBar } from 'pages/sidebar/ManagerBar';

export const MenuMobile = () => {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <Flex
      as="header"
      w="100%"
      bg="#F6F6F6"
      flexDir="column"
      justifyContent="center"
      position="fixed"
      top="0"
      left="0"
      zIndex="9999"
      display={{ base: 'block', lg: 'none' }}
    >
      <Container py="2">
        <Flex flexDir="row" w="100%" maxH="64px" justifyContent="space-between" alignItems="center">
          <HStack spacing={2}>
            <Box>
              {isOpen ? (
                <CloseButton onClick={onToggle} />
              ) : (
                <Button border="none" px="1" bg="#F6F6F6" onClick={onToggle}>
                  <VStack spacing={1}>
                    <Box bg="black" h="2px" w="20px" />
                    <Box bg="black" h="2px" w="20px" />
                    <Box bg="black" h="2px" w="20px" />
                  </VStack>
                </Button>
              )}
            </Box>
            {!isOpen && (
              <Box _focus={{ outline: 'none' }} w={{ base: '100px', lg: '100px' }}>
                <Image src={logo} alt="Logo AppJusto" width="100%" loading="eager" />
              </Box>
            )}
          </HStack>
        </Flex>
      </Container>
      <Collapse in={isOpen} animateOpacity>
        <Links />
        <ManagerBar />
      </Collapse>
    </Flex>
  );
};
