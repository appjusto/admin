import { Box, BoxProps } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { LinkItem } from './LinkItem';
import { OrdersLinkItem } from './OrdersLinkItem';

export const Links = (props: BoxProps) => {
  // context
  const { business } = useContextBusiness();
  const { url } = useRouteMatch();
  // helpers
  const isBusinessPending = business?.situation !== 'approved';
  // UI
  return (
    <Box {...props}>
      <Box>
        <LinkItem to={`${url}`} label={t('Início')} />
        <OrdersLinkItem to={`${url}/orders`} isDisabled={isBusinessPending} />
        <LinkItem
          to={`${url}/sharing`}
          label={t('Compartilhamento')}
          isDisabled={isBusinessPending}
        />
      </Box>
      <Box mt="5">
        <LinkItem to={`${url}/menu`} label={t('Cardápio')} />
        <LinkItem to={`${url}/business-schedules`} label={t('Horários')} />
        <LinkItem to={`${url}/delivery-area`} label={t('Área de entrega')} />
        <LinkItem to={`${url}/orders-history`} label={t('Histórico de pedidos')} />
        <LinkItem to={`${url}/finances`} label={t('Financeiro')} />
        <LinkItem to={`${url}/business-profile`} label={t('Perfil do restaurante')} />
        <LinkItem to={`${url}/banking-information`} label={t('Dados bancários')} />
        <LinkItem to={`${url}/team`} label={t('Colaboradores')} />
      </Box>
    </Box>
  );
};
