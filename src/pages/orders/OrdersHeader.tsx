import { Flex, HStack, Image, Link, Switch, Text } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextBusiness } from 'app/state/business/context';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import logo from 'common/img/logo.svg';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { t } from 'utils/i18n';

interface OrdersHeaderProps {
  statusEnabled?: boolean;
}

export const OrdersHeader = ({ statusEnabled = true }: OrdersHeaderProps) => {
  // context
  const { business } = useContextBusiness();
  const { updateBusinessProfile, updateResult } = useBusinessProfile();
  const { isError, error } = updateResult;

  // state
  const [isOpen, setIsOpen] = React.useState(false);

  // refs
  const submission = React.useRef(0);

  // helpers
  const isEnabled = business?.enabled ?? false;
  let statusMessage = 'Para habilitar, é preciso ir até perfil do restaurante e ligá-lo';
  if (isEnabled) {
    if (isOpen) statusMessage = 'Aceitando pedidos';
    else statusMessage = 'Clique para abrir o restaurante e receber pedidos';
  }

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
          {statusEnabled && (
            <Switch
              isDisabled={!isEnabled}
              isChecked={isOpen}
              onChange={(ev) => {
                ev.stopPropagation();
                submission.current += 1;
                updateBusinessProfile({ status: ev.target.checked ? 'open' : 'closed' });
              }}
            />
          )}
          <Flex ml="4" flexDir="column" minW="280px">
            <Text fontSize="16px" fontWeight="700" lineHeight="22px">
              {isOpen ? t('Restaurante aberto') : t('Restaurante fechado')}
            </Text>
            <Text fontSize="xs">{statusMessage}</Text>
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
      <SuccessAndErrorHandler submission={submission.current} isError={isError} error={error} />
    </Flex>
  );
};
