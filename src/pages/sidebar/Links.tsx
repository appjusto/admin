import { Box, Text } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { LinksContainer } from './LinksContainer';

export const Links = () => {
  // context
  const isDev = process.env.NODE_ENV === 'development';
  const business = useContextBusiness();
  const { url } = useRouteMatch();

  const isApproved = business?.situation === 'approved';

  return (
    <Box ml="1">
      <Box>
        <LinksContainer>
          <Link to={`${url}`}>{t('Início')}</Link>
          {isApproved ? (
            <Link to={`${url}/orders`}>{t('Gerenciador de pedidos')}</Link>
          ) : (
            <Text color="gray.600">{t('Gerenciador de pedidos')}</Text>
          )}
        </LinksContainer>
      </Box>
      <Box mt="6">
        <LinksContainer>
          <Link to={`${url}/menu`}>{t('Cardápio')}</Link>
          <Link to={`${url}/business-schedules`}>{t('Horários')}</Link>
          <Link to={`${url}/delivery-area`}>{t('Área de entrega')}</Link>
        </LinksContainer>
        {isDev ? (
          <LinksContainer>
            <Link to={`${url}/orders-history`}>{t('Histórico de pedidos')}</Link>
            <Link to={`${url}/finances`}>{t('Financeiro')}</Link>
            <Link to={`${url}/business-profile`}>{t('Perfil do restaurante')}</Link>
            <Link to={`${url}/team`}>{t('Colaboradores')}</Link>
          </LinksContainer>
        ) : (
          <LinksContainer>
            <Text color="gray.600">{t('Histórico de pedidos')}</Text>
            <Text color="gray.600">{t('Financeiro')}</Text>
            <Link to={`${url}/business-profile`}>{t('Perfil do restaurante')}</Link>
            <Text color="gray.600">{t('Colaboradores')}</Text>
          </LinksContainer>
        )}
      </Box>
    </Box>
  );
};
