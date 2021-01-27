import { Flex, HStack, Link, Text } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import { ReactComponent as Logo } from 'common/img/logo.svg';
import { BusinessStatus } from 'pages/sidebar/BusinessStatus';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { t } from 'utils/i18n';

export const OrdersHeader = () => {
  const business = useContextBusiness();
  let managerEmail = '';
  if (business?.managers) {
    managerEmail = business?.managers[0];
  }
  return (
    <Flex p="6" h="76px" flex={1} alignItems="center" justifyContent="space-between" bg="gray.50">
      <HStack spacing={2}>
        <Text fontSize="md" color="black">
          {business?.name}
        </Text>
        <BusinessStatus ml="2" />
      </HStack>
      <Logo />
      <HStack spacing={6}>
        <HStack spacing={2}>
          <Text fontWeight="700">{t('Administrador')}:</Text>
          <Text>{managerEmail}</Text>
        </HStack>
        <Link ml="8" as={RouterLink} to="/logout">
          <Text textStyle="link">{t('Sair')}</Text>
        </Link>
      </HStack>
    </Flex>
  );
};
