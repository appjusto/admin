import { Center, Container, Flex, Link, Text } from '@chakra-ui/react';
import { ReactComponent as Logo } from 'common/img/logo.svg';
import { Link as RouterLink } from 'react-router-dom';
import { t } from 'utils/i18n';

const PageNotFound = () => {
  // UI
  return (
    <Center height="100vh">
      <Container mt="4">
        <Flex w="100%" justifyContent="center" alignItems="center">
          <Logo />
        </Flex>
        <Text
          mt="10"
          fontSize="21px"
          lineHeight="28px"
          fontWeight="700"
          textAlign="center"
        >
          {t('Página não encontrada =/')}
        </Text>
        <Flex mt="10" w="100%" justifyContent="center" alignItems="center">
          <Link as={RouterLink} to="/app" textDecor="underline">
            {t('Voltar para a home')}
          </Link>
        </Flex>
      </Container>
    </Center>
  );
};

export default PageNotFound;
