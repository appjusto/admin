import { Box } from '@chakra-ui/react';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { LinkItem } from './LinkItem';

export const BackOfficeLinks = () => {
  // context
  //const isDev = process.env.NODE_ENV === 'development';
  const { url } = useRouteMatch();

  return (
    <Box mt="10">
      <LinkItem to={`${url}`} label={t('Visão geral')} />
      <LinkItem to={`${url}/support`} label={t('Suporte')} />
      <LinkItem to={`${url}/orders`} label={t('Pedidos')} />
      <LinkItem to={`${url}/couriers`} label={t('Entregadores')} />
      <LinkItem to={`${url}/business`} label={t('Restaurantes')} />
    </Box>
  );
};
