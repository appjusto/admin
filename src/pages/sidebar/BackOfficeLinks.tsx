import { Box, BoxProps } from '@chakra-ui/react';
import { useContextAgentProfile } from 'app/state/agent/context';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { LinkItem } from './LinkItem';

export const BackOfficeLinks = (props: BoxProps) => {
  // context
  const isDev = process.env.REACT_APP_ENVIRONMENT === 'dev';
  const { url } = useRouteMatch();
  const { role } = useContextAgentProfile();

  if (role === 'courier-manager') {
    return (
      <Box mt="10" {...props}>
        <LinkItem to={`${url}/couriers`} label={t('Entregadores')} />
      </Box>
    );
  } else
    return (
      <Box mt="10" {...props}>
        <LinkItem to={`${url}`} label={t('Visão geral')} />
        <LinkItem to={`${url}/orders`} label={t('Pedidos')} />
        <LinkItem to={`${url}/couriers`} label={t('Entregadores')} />
        <LinkItem to={`${url}/businesses`} label={t('Restaurantes')} />
        <LinkItem to={`${url}/consumers`} label={t('Clientes')} />
        <LinkItem to={`${url}/invoices`} label={t('Faturas')} />
        {role === 'owner' && isDev && <LinkItem to={`${url}/agents`} label={t('Agentes')} />}
      </Box>
    );
};
