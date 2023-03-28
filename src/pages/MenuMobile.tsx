import {
  Box,
  Button,
  CloseButton,
  Collapse,
  Flex,
  HStack,
  Image,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import Container from 'common/components/Container';
import logo from 'common/img/logo.svg';
import { BackOfficeLinks } from 'pages/sidebar/BackOfficeLinks';
import BusinessInfo from 'pages/sidebar/BusinessInfo';
import { Links } from 'pages/sidebar/Links';
import { ManagerBar } from 'pages/sidebar/ManagerBar';
import { useRouteMatch } from 'react-router';

export const MenuMobile = () => {
  // context
  const { path } = useRouteMatch();
  const { isOpen, onToggle } = useDisclosure();
  const { isBackofficeUser } = useContextFirebaseUser();
  const isBackOffice = path.includes('backoffice');
  //UI
  return (
    <>
      <Flex
        as="header"
        w="100vw"
        bg="#F6F6F6"
        flexDir="column"
        justifyContent="center"
        position="fixed"
        top="0"
        left="0"
        pb={isOpen ? '2' : '0'}
        zIndex="9999"
        display={{ base: 'flex', lg: 'none' }}
      >
        <Container maxW="990px" py="2" px="4">
          <Flex
            flexDir="row"
            w="100%"
            maxH="64px"
            justifyContent="space-between"
            alignItems="center"
          >
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
                <Box _focus={{ outline: 'none' }} w="90px">
                  <Image
                    src={logo}
                    alt="Logo AppJusto"
                    width="100%"
                    loading="eager"
                  />
                </Box>
              )}
            </HStack>
          </Flex>
        </Container>
        <Collapse in={isOpen} animateOpacity>
          {isBackOffice ? (
            <BackOfficeLinks onClick={onToggle} />
          ) : (
            <Box>
              <Box ml="4" mt="2">
                <BusinessInfo />
              </Box>
              <Box mt="4">
                <Links onClick={onToggle} />
              </Box>
            </Box>
          )}
          {((!isBackOffice && !isBackofficeUser) ||
            (isBackOffice && isBackofficeUser)) && (
            <ManagerBar onClick={onToggle} />
          )}
        </Collapse>
      </Flex>
      {isOpen && (
        <Box
          position="absolute"
          top="0"
          left="0"
          w="100vw"
          h="100vh"
          bgColor="blackAlpha.500"
          zIndex="990"
          onClick={onToggle}
        />
      )}
    </>
  );
};
