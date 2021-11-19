import { Box, BoxProps } from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { LinkItem } from './LinkItem';

export const BackOfficeLinks = (props: BoxProps) => {
  // context
  const isDev = process.env.REACT_APP_ENVIRONMENT === 'dev';
  const { url } = useRouteMatch();
  const { role } = useContextFirebaseUser();

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
        <LinkItem to={`${url}/users`} label={t('Usuários')} />
        <LinkItem to={`${url}/recommendations`} label={t('Recomendações')} />
        <LinkItem to={`${url}/fraud-prevention`} label={t('Antifraude')} />
        {role === 'owner' && isDev && <LinkItem to={`${url}/agents`} label={t('Agentes')} />}
      </Box>
    );
};
