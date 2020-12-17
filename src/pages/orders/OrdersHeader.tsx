import { Flex, Link, Spacer, Text } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import { ReactComponent as Logo } from 'common/img/logo.svg';
import { BusinessStatus } from 'pages/sidebar/BusinessStatus';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { t } from 'utils/i18n';

export const OrdersHeader = () => {
  const business = useContextBusiness();
  return (
    <Flex p="6" h="76px" flex={1} alignItems="center" bg="gray.50">
      <Text fontSize="md" color="black">
        {business?.name}
      </Text>
      <BusinessStatus ml="2" />
      <Spacer />
      <Logo />
      <Spacer />
      <Link ml="8" as={RouterLink} to="/logout">
        <Text textStyle="link">{t('Sair')}</Text>
      </Link>
    </Flex>
  );
};
