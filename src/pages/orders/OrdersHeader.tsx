import { Box, Circle, Flex, HStack, Image, Link, Text } from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useOrdersContext } from 'app/state/order';
import logo from 'common/img/logo.svg';
import { Link as RouterLink } from 'react-router-dom';
import { t } from 'utils/i18n';
import packageInfo from '../../../package.json';
const version = packageInfo.version;

export const OrdersHeader = () => {
  // context
  const { user, adminRole } = useContextFirebaseUser();
  const { isBusinessOpen } = useOrdersContext();
  // UI
  return (
    <Flex
      p="6"
      h="76px"
      flex={1}
      alignItems="center"
      justifyContent="space-between"
      bg="#EEEEEE"
    >
      <HStack spacing={6}>
        <Flex flexDir="row">
          <Box pt="7px" pr="2">
            <Circle size="10px" bg={isBusinessOpen ? 'green.500' : 'red'} />
          </Box>
          <Flex flexDir="column" minW={{ lg: '280px' }}>
            <Text
              fontSize={{ base: '13px', lg: '16px' }}
              fontWeight="700"
              lineHeight="22px"
            >
              {isBusinessOpen
                ? t('Restaurante aberto')
                : t('Restaurante fechado')}
              <Text
                ml="2"
                as="span"
                fontSize="11px"
                lineHeight="16px"
                fontWeight="700"
                letterSpacing="0.6px"
              >
                {t(`v${version ?? 'N/E'}`)}
              </Text>
            </Text>
            {adminRole === 'manager' && (
              <Link as={RouterLink} to="/app/business-schedules">
                <Text
                  fontSize={{ base: '13px', lg: '15px' }}
                  fontWeight="500"
                  textStyle="link"
                >
                  {t('Alterar horário de funcionamento')}
                </Text>
              </Link>
            )}
          </Flex>
        </Flex>
      </HStack>
      <Image src={logo} maxW="94px" display={{ base: 'none', lg: 'block' }} />
      <HStack spacing={6} display={{ base: 'none', lg: 'flex' }}>
        <HStack spacing={1}>
          <Text fontSize="16px" fontWeight="700">
            {t('Usuário')}:
          </Text>
          <Text fontSize="16px">{user?.email ?? 'N/E'}</Text>
        </HStack>
        <Link as={RouterLink} to="/app">
          <Text fontWeight="700" textStyle="link">
            {t('Portal do parceiro')}
          </Text>
        </Link>
        <Link ml="8" as={RouterLink} to="/logout">
          <Text fontWeight="700" textStyle="link">
            {t('Sair')}
          </Text>
        </Link>
      </HStack>
      <Link as={RouterLink} to="/app" display={{ base: 'block', lg: 'none' }}>
        <Text fontWeight="700" textStyle="link">
          {t('Voltar')}
        </Text>
      </Link>
    </Flex>
  );
};
