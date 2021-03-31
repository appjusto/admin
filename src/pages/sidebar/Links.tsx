import { Box, Text } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { LinkItem } from './LinkItem';

export const Links = () => {
  // context
  const isDev = process.env.NODE_ENV === 'development';
  const business = useContextBusiness();
  const { url } = useRouteMatch();

  const isApproved = business?.situation === 'approved';

  return (
    <Box>
      <Box>
        <LinkItem to={`${url}`} label={t('Início')} />
        {isApproved ? (
          <LinkItem to={`${url}/orders`} label={t('Gerenciador de pedidos')} />
        ) : (
          <Text color="gray.600">{t('Gerenciador de pedidos')}</Text>
        )}
      </Box>
      <Box mt="5">
        <LinkItem to={`${url}/menu`} label={t('Cardápio')} />
        <LinkItem to={`${url}/business-schedules`} label={t('Horários')} />
        <LinkItem to={`${url}/delivery-area`} label={t('Área de entrega')} />
        {isDev ? (
          <>
            <LinkItem to={`${url}/orders-history`} label={t('Histórico de pedidos')} />
            <LinkItem to={`${url}/finances`} label={t('Financeiro')} />
            <LinkItem to={`${url}/business-profile`} label={t('Perfil do restaurante')} />
            <LinkItem to={`${url}/team`} label={t('Colaboradores')} />
          </>
        ) : (
          <>
            <Text color="gray.600">{t('Histórico de pedidos')}</Text>
            <Text color="gray.600">{t('Financeiro')}</Text>
            <LinkItem to={`${url}/business-profile`} label={t('Perfil do restaurante')} />
            <Text color="gray.600">{t('Colaboradores')}</Text>
          </>
        )}
      </Box>
    </Box>
  );
};
