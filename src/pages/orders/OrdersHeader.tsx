import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Box,
  Circle,
  Flex,
  HStack,
  Image,
  Link,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import { useOrdersContext } from 'app/state/order';
import logo from 'common/img/logo.svg';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import packageInfo from '../../../package.json';
const version = packageInfo.version;

export const OrdersHeader = () => {
  // context
  const { path } = useRouteMatch();
  const { user } = useContextFirebaseUser();
  const { business } = useContextBusiness();
  const { isBusinessOpen } = useOrdersContext();
  // helpers
  const isBusinessAvailable = business?.status === 'available';
  // UI
  return (
    <Flex
      py="6"
      px={{ base: '4', md: '8' }}
      h="76px"
      flex={1}
      alignItems="center"
      justifyContent="space-between"
      bg="#EEEEEE"
    >
      <HStack spacing={6}>
        <Link as={RouterLink} to="/app">
          <Tooltip placement="top" label={t('Voltar')}>
            <ArrowBackIcon w="22px" h="22px" mr="2" mb="-2px" />
          </Tooltip>
        </Link>
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
            <Link
              as={RouterLink}
              to={`${path}/business-status`}
              fontSize="13px"
              lineHeight="16px"
              textDecor="underline"
              cursor="pointer"
              color={isBusinessAvailable ? 'gray.800' : 'red'}
              _focus={{ outline: 'none' }}
            >
              {isBusinessAvailable
                ? t('Ativar fechamento de emergência')
                : t('Desativar fechamento de emergência')}
            </Link>
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
      </HStack>
    </Flex>
  );
};
