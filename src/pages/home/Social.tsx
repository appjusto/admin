import { Box, HStack, Icon, Link, Text } from '@chakra-ui/react';
import { FaFacebookSquare, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { t } from 'utils/i18n';

export const Social = () => {
  return (
    <Box color="black">
      <HStack mt="12" spacing={2}>
        <Text fontSize="xl" lineHeight="30px" fontWeight="700">
          {t('Aproveite para seguir o appjusto nas redes sociais')}
        </Text>
        <Link
          href="https://www.instagram.com/appjusto/"
          isExternal
          aria-label="Link para a página do Instagram do appjusto"
          _hover={{ color: 'green.500' }}
          _focus={{ outline: 'none' }}
        >
          <Icon as={FaInstagram} w="30px" h="30px" />
        </Link>
        <Link
          href="https://www.facebook.com/appjusto"
          isExternal
          aria-label="Link para a página do Facebook do appjusto"
          _hover={{ color: 'green.500' }}
          _focus={{ outline: 'none' }}
        >
          <Icon as={FaFacebookSquare} w="30px" h="30px" />
        </Link>
        <Link
          href="https://www.linkedin.com/company/appjusto/"
          isExternal
          aria-label="Link para a página do Linkedin do appjusto"
          _hover={{ color: 'green.500' }}
          _focus={{ outline: 'none' }}
        >
          <Icon as={FaLinkedin} w="30px" h="30px" />
        </Link>
      </HStack>
      <Text mt="2" fontSize="lg" lineHeight="26px">
        {t('E fique por dentro das nossas novidades!')}
      </Text>
    </Box>
  );
};
