import { Flex, Icon, Link, Text } from '@chakra-ui/react';
import Container from 'common/components/Container';
import ShareButton from 'common/components/landing/ShareButton';
import React from 'react';
import { FaFacebookSquare, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { MdMailOutline } from 'react-icons/md';
import { Link as ScrollLink } from 'react-scroll';
import { t } from 'utils/i18n';

export const LandingPageFooter = () => {
  // state
  const [pageLimit, setPageLimit] = React.useState(false);
  // handlers
  const handleScroll = () => {
    const width =
      window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width > 1000) {
      if (document.documentElement.scrollTop > 1550) {
        setPageLimit(true);
      } else {
        setPageLimit(false);
      }
    }
  };
  // side effects
  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll, true);
    return window.removeEventListener('scroll', handleScroll);
  }, []);
  // UI
  return (
    <>
      <Flex
        as="footer"
        w="100%"
        py="6"
        justifyContent="center"
        alignItems="center"
        bg="black"
        fontFamily="Barlow"
      >
        <Container pt="0">
          <Flex
            flexDir={{ base: 'column', md: 'row' }}
            justifyContent="space-between"
            textDecoration="underline"
          >
            <Flex
              w="100%"
              m="0"
              p="0"
              flexDir={['column', null, null, 'row']}
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Flex
                flexDir="row"
                justifyContent="space-between"
                alignItems="center"
                color="white"
                mb={['22px', null, null, '0']}
                mr={['0', null, null, '26px']}
              >
                <Icon as={MdMailOutline} color="green.500" mr="12px" w="20px" h="20px" />
                <Link
                  name="contact_footer"
                  href="mailto:contato@appjusto.com.br"
                  color="white"
                  _hover={{ color: '#055AFF' }}
                  _focus={{ outline: 'none' }}
                >
                  contato@appjusto.com.br
                </Link>
              </Flex>
              <Flex
                flexDir="row"
                justifyContent="space-between"
                alignItems="center"
                color="white"
                mb={['26px', null, null, '0']}
              >
                <Link
                  href="https://www.linkedin.com/company/appjusto/"
                  isExternal
                  mr="28px"
                  color="green.500"
                  aria-label="Link para a página do Linkedin do Appjusto"
                  _hover={{ color: '#055AFF' }}
                  _focus={{ outline: 'none' }}
                >
                  <Icon as={FaLinkedin} w="20px" h="20px" />
                </Link>
                <Link
                  href="https://www.facebook.com/appjusto"
                  isExternal
                  mr="28px"
                  color="green.500"
                  aria-label="Link para a página do Facebook do Appjusto"
                  _hover={{ color: '#055AFF' }}
                  _focus={{ outline: 'none' }}
                >
                  <Icon as={FaFacebookSquare} w="20px" h="20px" />
                </Link>
                <Link
                  href="https://www.instagram.com/appjusto/"
                  isExternal
                  mr="28px"
                  color="green.500"
                  aria-label="Link para a página do Instagram do Appjusto"
                  _hover={{ color: '#055AFF' }}
                  _focus={{ outline: 'none' }}
                >
                  <Icon as={FaInstagram} w="20px" h="20px" />
                </Link>
              </Flex>
            </Flex>
            <Flex
              w="100%"
              m="0"
              p="0"
              flexDir={['column', null, null, 'row']}
              justifyContent={['flex-start', null, null, 'flex-end']}
              alignItems={['flex-start', null, null, 'flex-end']}
              color="white"
            >
              <Link
                //isExternal
                //href="/"
                color="white"
                mb={['22px', null, null, '0']}
                fontSize="15px"
                mr={['0', null, null, '16px']}
                _hover={{ color: '#055AFF' }}
                _focus={{ outline: 'none' }}
              >
                {t('Política de Privacidade')}
              </Link>
              <Link
                isExternal
                href="https://github.com/appjusto/docs/blob/main/legal/termo-tratamento-de-dados.md"
                color="white"
                mb={['22px', null, null, '0']}
                fontSize="15px"
                mr={['0', null, null, '16px']}
                _hover={{ color: '#055AFF' }}
                _focus={{ outline: 'none' }}
              >
                {t('Termos de uso')}
              </Link>
              <Text mb={['22px', null, null, '0']} fontSize="15px">
                © {new Date().getFullYear()} AppJusto. {t('Marca Registrada')}.
              </Text>
            </Flex>
          </Flex>
        </Container>
      </Flex>
      <Flex
        w="100%"
        display={{ base: 'none', md: `${pageLimit ? 'none' : 'block'}` }}
        position={{ md: 'fixed' }}
        bottom={{ md: '0' }}
        bg="black"
        py="2"
        zIndex="999"
      >
        <Container
          pt="0"
          display="flex"
          flexDir={{ base: 'column', md: 'row' }}
          alignItems={{ base: 'flex-start', md: 'center' }}
        >
          <ScrollLink
            activeClass="active"
            to="shareSection"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
          >
            <ShareButton bg="green.500" />
          </ScrollLink>
          <Text display={{ base: 'none', md: 'block' }} ml="4" color="green.500" textDecor="none">
            {t(
              'Espalhe essa notícia e faça mais gente conhecer esse movimento por uma economia mais justa!'
            )}
          </Text>
        </Container>
      </Flex>
    </>
  );
};
