import { Flex, HStack, Image, Link, Switch, Text } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextBusiness } from 'app/state/business/context';
import logo from 'common/img/logo.svg';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { t } from 'utils/i18n';

export const OrdersHeader = () => {
  // context
  const { business } = useContextBusiness();
  const { updateBusinessProfile } = useBusinessProfile();
  // state
  const [isOpen, setIsOpen] = React.useState(false);

  let managerEmail = '';
  if (business?.managers) {
    managerEmail = business?.managers[0];
  }

  // side effects
  React.useEffect(() => {
    setIsOpen(business?.status === 'open' ? true : false);
  }, [business?.status]);

  return (
    <Flex p="6" h="76px" flex={1} alignItems="center" justifyContent="space-between" bg="gray.50">
      <HStack spacing={6}>
        <Flex alignItems="center">
          <Switch
            isChecked={isOpen}
            onChange={(ev) => {
              ev.stopPropagation();
              updateBusinessProfile({ status: ev.target.checked ? 'open' : 'closed' });
            }}
          />
          <Flex ml="4" flexDir="column" minW="280px">
            <Text fontSize="16px" fontWeight="700" lineHeight="22px">
              {isOpen ? t('Restaurante aberto') : t('Restaurante fechado')}
            </Text>
            <Text fontSize="xs">
              {isOpen
                ? t('Aceitando pedidos')
                : t('Clique para abrir o restaurante e receber pedidos')}
            </Text>
          </Flex>
        </Flex>
      </HStack>
      <Image src={logo} maxW="94px" />
      <HStack spacing={6}>
        <HStack spacing={1}>
          <Text fontSize="16px" fontWeight="700">
            {t('Administrador')}:
          </Text>
          <Text fontSize="16px">{managerEmail}</Text>
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
    </Flex>
  );
};
