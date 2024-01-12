import {
  Box,
  Button,
  CloseButton,
  Collapse,
  Flex,
  HStack,
  Icon,
  Link,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import Container from 'common/components/Container';
import Image from 'common/components/Image';
import logo from 'common/img/logo.svg';
import { FaFacebookSquare, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import { t } from 'utils/i18n';

export const Header = () => {
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
    >
      <Container py="2">
        <Flex
          flexDir="row"
          w="100%"
          maxH="64px"
          justifyContent="space-between"
          alignItems="center"
        >
          <HStack spacing={2}>
            <Box display={{ base: 'block', lg: 'none' }}>
              {isOpen ? (
                <CloseButton onClick={onToggle} />
              ) : (
                <Button
                  border="none"
                  px="1"
                  bg="#F6F6F6"
                  onClick={onToggle}
                  variant="unstyled"
                  _focus={{ outline: 'none' }}
                >
                  <VStack spacing={1}>
                    <Box bg="black" h="2px" w="20px" />
                    <Box bg="black" h="2px" w="20px" />
                    <Box bg="black" h="2px" w="20px" />
                  </VStack>
                </Button>
              )}
            </Box>
            {!isOpen && (
              <Box
                _focus={{ outline: 'none' }}
                w={{ base: '100px', lg: '100px' }}
              >
                <Image
                  src={logo}
                  alt="Logo appjusto"
                  width="100%"
                  loading="eager"
                />
              </Box>
            )}
          </HStack>
          <HStack
            spacing={8}
            display={{ base: 'none', lg: 'block' }}
            minW={{ lg: '712px' }}
          >
            <Link
              fontSize="16px"
              lineHeight="22px"
              fontWeight="700"
              _focus={{ outline: 'none' }}
              href="https://appjusto.com.br"
              isExternal
            >
              {t('Entregadores e clientes')}
            </Link>
            <Link
              fontSize="16px"
              lineHeight="22px"
              fontWeight="500"
              _focus={{ outline: 'none' }}
              href="https://appjusto.freshdesk.com/support/home"
              isExternal
            >
              {t('Tirar dúvidas sobre o appjusto')}
            </Link>
            <Link as={RouterLink} _focus={{ outline: 'none' }} to="/app">
              <Button
                bg="#F6F6F6"
                minH="48px"
                w="260px"
                variant="outline"
                fontFamily="barlow"
                fontSize="16px"
                fontWeight="500"
                borderColor="black"
              >
                {t('Acessar painel do restaurante')}
              </Button>
            </Link>
          </HStack>
          <Link
            as={RouterLink}
            display={{ base: 'block', lg: 'none' }}
            _focus={{ outline: 'none' }}
            to="/app"
          >
            <Button
              bg="#F6F6F6"
              minH="48px"
              variant="outline"
              fontFamily="barlow"
              fontSize="16px"
              fontWeight="500"
              borderColor="black"
            >
              {t('Acessar painel')}
            </Button>
          </Link>
        </Flex>
      </Container>
      <Collapse in={isOpen} animateOpacity>
        <Box bg="#F6F6F6" w="100%" p="6">
          <VStack spacing={6} alignItems="flex-start">
            <Link
              fontSize="16px"
              lineHeight="22px"
              fontWeight="700"
              _focus={{ outline: 'none' }}
              href="https://appjusto.com.br"
              isExternal
            >
              {t('Entregadores e clientes')}
            </Link>
            <Link
              fontSize="16px"
              lineHeight="22px"
              fontWeight="500"
              _focus={{ outline: 'none' }}
              href="https://appjusto.freshdesk.com/support/home"
              isExternal
            >
              {t('Tirar dúvidas sobre o appjusto')}
            </Link>
            <HStack spacing={8}>
              <Link
                aria-label="go to linkedin"
                href="https://www.linkedin.com/company/appjusto/"
                isExternal
                color="black"
              >
                <Icon as={FaLinkedin} w="20px" h="20px" />
              </Link>
              <Link
                aria-label="go to facebook"
                href="https://www.facebook.com/appjusto"
                isExternal
                color="black"
              >
                <Icon as={FaFacebookSquare} w="20px" h="20px" />
              </Link>
              <Link
                aria-label="go to instagram"
                href="https://www.instagram.com/appjusto/"
                isExternal
                color="black"
              >
                <Icon as={FaInstagram} w="20px" h="20px" />
              </Link>
            </HStack>
          </VStack>
        </Box>
      </Collapse>
    </Flex>
  );
};
