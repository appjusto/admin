import { Flex, Icon, Link, Text } from '@chakra-ui/react';
import Container from 'common/components/Container';
import ShareButton from 'common/components/landing/ShareButton';
import { FaFacebookSquare, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { MdMailOutline } from 'react-icons/md';
import { t } from 'utils/i18n';
//import Link from './CustomLink'

export const LandingPageFooter = () => {
  return (
    <Flex
      as="footer"
      w="100%"
      pt="16"
      pb="4"
      justifyContent="center"
      alignItems="center"
      bg="black"
      fontFamily="Barlow"
    >
      <Container pt="0">
        <Flex
          flexDir={['column', null, null, 'row']}
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
              <Link name="contact_footer" link="mailto:contato@appjusto.com.br" color="white">
                contato@appjusto.com.br
              </Link>
            </Flex>
            <Flex
              flexDir="row"
              justifyContent="space-between"
              alignItems="center"
              color="white"
              mb={['26px', null, null, '0']}
              display={['none', null, null, 'block']}
            >
              <Link
                link="https://www.linkedin.com/company/appjusto/"
                isExternal
                mr="28px"
                color="green.500"
                aria-label="Link para a página do Linkedin do Appjusto"
              >
                <Icon as={FaLinkedin} w="20px" h="20px" />
              </Link>
              <Link
                link="https://www.facebook.com/appjusto"
                isExternal
                mr="28px"
                color="green.500"
                aria-label="Link para a página do Facebook do Appjusto"
              >
                <Icon as={FaFacebookSquare} w="20px" h="20px" />
              </Link>
              <Link
                link="https://www.instagram.com/appjusto/"
                isExternal
                mr="28px"
                color="green.500"
                aria-label="Link para a página do Instagram do Appjusto"
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
              link="/"
              color="white"
              mb={['22px', null, null, '0']}
              fontSize="15px"
              mr={['0', null, null, '16px']}
              isExternal
            >
              {t('Política de Privacidade')}
            </Link>
            <Link
              link="https://github.com/appjusto/docs/blob/main/legal/termo-tratamento-de-dados.md"
              color="white"
              mb={['22px', null, null, '0']}
              fontSize="15px"
              mr={['0', null, null, '16px']}
              isExternal
            >
              {t('Termos de uso')}
            </Link>
            <Text mb={['22px', null, null, '0']} fontSize="15px">
              © {new Date().getFullYear()} AppJusto. {t('Marca Registrada')}.
            </Text>
          </Flex>
        </Flex>
        <Flex mt="16" flexDir={['column', null, null, 'row']} alignItems="center">
          <ShareButton bg="green.500" />
          <Text ml="4" color="green.500" textDecor="none">
            {t(
              'Espalhe essa notícia e faça mais gente conhecer esse movimento por uma economia mais justa!'
            )}
          </Text>
        </Flex>
      </Container>
    </Flex>
  );
};
