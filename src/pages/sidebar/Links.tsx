import { Box, Flex, Text } from '@chakra-ui/react';
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

const ProtectedLinks = () => {
  // context
  const isLive = process.env.REACT_APP_ENVIRONMENT === 'live';
  const { url } = useRouteMatch();
  // UI
  return (
    <>
      <LinkItem to={`${url}/business-schedules`} label={t('Horários')} />
      <LinkItem to={`${url}/delivery-area`} label={t('Área de entrega')} />
      {!isLive ? (
        <>
          <LinkItem to={`${url}/orders-history`} label={t('Histórico de pedidos')} />
          <LinkItem to={`${url}/finances`} label={t('Financeiro')} />
          <LinkItem to={`${url}/business-profile`} label={t('Perfil do restaurante')} />
          <LinkItem to={`${url}/team`} label={t('Colaboradores')} />
        </>
      ) : (
        <>
          <LinkItem to={`${url}/orders-history`} label={t('Histórico de pedidos')} />
          <DisabledLink label={t('Financeiro')} />
          <LinkItem to={`${url}/business-profile`} label={t('Perfil do restaurante')} />
          <DisabledLink label={t('Colaboradores')} />
        </>
      )}
    </>
  );
};

export const Links = () => {
  // context
  const { business, userRole } = useContextBusiness();
  const { url } = useRouteMatch();

  const isApproved = business?.situation === 'approved';
  const isManager = userRole === 'manager';
  console.log(userRole);
  return (
    <Box>
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
        {isManager && <ProtectedLinks />}
      </Box>
    </Box>
  );
};
