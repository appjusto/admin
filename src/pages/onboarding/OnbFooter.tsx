import { Box, Flex, Link, Stack, Text } from '@chakra-ui/react';
import Container from 'common/components/Container';
import { Link as RouterLink } from 'react-router-dom';
import { t } from 'utils/i18n';

const OnbFooter = () => {
  return (
    <Box
      position="relative"
      mt="120px"
      w="100%"
      minH="106px"
      bg="black"
      zIndex="9999"
    >
      <Container py="10">
        <Flex
          flexDir={{ base: 'column', md: 'row' }}
          justifyContent="space-between"
        >
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={4}
            color="white"
            fontSize="sm"
            fontWeight="500"
          >
            <Link
              as={RouterLink}
              to="/"
              maxW="170px"
              textDecor="underline"
              _hover={{ color: 'gray.400' }}
            >
              Política de privacidade
            </Link>
            <Link
              as={RouterLink}
              to="/"
              maxW="120px"
              textDecor="underline"
              _hover={{ color: 'gray.400' }}
            >
              Termos de uso
            </Link>
            <Text>
              © {new Date().getFullYear()} AppJusto. Marca Registrada.
            </Text>
          </Stack>
          <Link
            as={RouterLink}
            to="/logout"
            mt={{ base: '4', md: '0' }}
            color="white"
            fontSize="sm"
            textDecor="underline"
            _hover={{ color: 'gray.400' }}
          >
            {t('Sair')}
          </Link>
        </Flex>
      </Container>
    </Box>
  );
};

export default OnbFooter;
