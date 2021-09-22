import { Box, BoxProps, Flex, Text } from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { LinkItem } from './LinkItem';

interface DisabledLinkProps {
  label: string;
}

const DisabledLink = ({ label }: DisabledLinkProps) => {
  return (
    <Flex pl="6" h="34px" alignItems="center">
      <Text color="gray.600">{label}</Text>
    </Flex>
  );
};

interface ProtectedLinksProps {
  isApproved: boolean;
}

const ProtectedLinks = ({ isApproved }: ProtectedLinksProps) => {
  // context
  const { url } = useRouteMatch();
  // UI
  return (
    <>
      <Box>
        <LinkItem to={`${url}`} label={t('Início')} />
        {isApproved ? (
          <LinkItem to={`${url}/orders`} label={t('Gerenciador de pedidos')} />
        ) : (
          <DisabledLink label={t('Gerenciador de pedidos')} />
        )}
      </Box>
      <Box mt="5">
        <LinkItem to={`${url}/menu`} label={t('Cardápio')} />
        <LinkItem to={`${url}/business-schedules`} label={t('Horários')} />
        <LinkItem to={`${url}/delivery-area`} label={t('Área de entrega')} />
        <LinkItem to={`${url}/orders-history`} label={t('Histórico de pedidos')} />
        <LinkItem to={`${url}/finances`} label={t('Financeiro')} />
        <LinkItem to={`${url}/business-profile`} label={t('Perfil do restaurante')} />
        <LinkItem to={`${url}/team`} label={t('Colaboradores')} />
      </Box>
    </>
  );
};

export const Links = (props: BoxProps) => {
  // context
  const { role, isBackofficeUser } = useContextFirebaseUser();
  const { business } = useContextBusiness();
  const { url } = useRouteMatch();
  // helpers
  const isApproved = business?.situation === 'approved';
  const isManager = role === 'manager' || isBackofficeUser;
  // UI
  return (
    <Box {...props}>
      {isManager ? (
        <ProtectedLinks isApproved={isApproved} />
      ) : (
        <Box mt="5">
          {isApproved ? (
            <LinkItem to={`${url}/orders`} label={t('Gerenciador de pedidos')} />
          ) : (
            <DisabledLink label={t('Gerenciador de pedidos')} />
          )}
          <LinkItem to={`${url}/menu`} label={t('Cardápio')} />
        </Box>
      )}
    </Box>
  );
};
