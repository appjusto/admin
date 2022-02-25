import { Box, Circle, Flex, HStack, Image, Link, Text } from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import logo from 'common/img/logo.svg';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { t } from 'utils/i18n';
import { version } from '../../../package.json';

export const OrdersHeader = () => {
  // context
  const { user, role } = useContextFirebaseUser();
  const { business } = useContextBusiness();
  // UI
  return (
    <Flex p="6" h="76px" flex={1} alignItems="center" justifyContent="space-between" bg="gray.50">
      <HStack spacing={6}>
        <Flex flexDir="row">
          <Box pt="7px" pr="2">
            <Circle size="10px" bg={business?.status === 'open' ? 'green.500' : 'red'} />
          </Box>
          <Flex flexDir="column" minW={{ lg: '280px' }}>
            <Text fontSize={{ base: '13px', lg: '16px' }} fontWeight="700" lineHeight="22px">
              {business?.status === 'open' ? t('Restaurante aberto') : t('Restaurante fechado')}
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
            {role === 'manager' && (
              <Link as={RouterLink} to="/app/business-schedules">
                <Text fontSize={{ base: '13px', lg: '15px' }} fontWeight="500" textStyle="link">
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
            {role === 'collaborator' ? t('Colaborador') : t('Administrador')}:
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
