import { Box } from '@chakra-ui/react';
import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { LinksContainer } from './LinksContainer';

export const BackOfficeLinks = () => {
  // context
  //const isDev = process.env.NODE_ENV === 'development';
  const { url } = useRouteMatch();

  return (
    <Box ml="1">
      <Box mt="6">
        <LinksContainer>
          <Link to={`${url}/dashboard`}>{t('Visão geral')}</Link>
          <Link to={`${url}/support`}>{t('Suporte')}</Link>
          <Link to={`${url}/orders`}>{t('Pedidos')}</Link>
          <Link to={`${url}/couriers`}>{t('Entregadores')}</Link>
          <Link to={`${url}/business`}>{t('Restaurantes')}</Link>
        </LinksContainer>
      </Box>
    </Box>
  );
};
