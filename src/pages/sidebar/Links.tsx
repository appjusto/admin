import { Box, BoxProps, Text } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { getBusinessService } from 'utils/functions';
import { t } from 'utils/i18n';
import { LinkItem } from './LinkItem';
import { OrdersLinkItem } from './OrdersLinkItem';

export const Links = (props: BoxProps) => {
  // context
  const { business } = useContextBusiness();
  const { url } = useRouteMatch();
  // helpers
  const isBusinessPending = business?.situation !== 'approved';
  const isLogistics = React.useMemo(
    () => getBusinessService(business?.services, 'logistics') !== undefined,
    [business?.services]
  );
  // UI
  return (
    <Box {...props}>
      <Box>
        <Text ml="3" mb="2" fontSize="xs" fontWeight="700" color="gray.600">
          {t('GERAL')}
        </Text>
        <LinkItem to={`${url}`} label={t('Início')} />
        <OrdersLinkItem to={`${url}/orders`} isDisabled={isBusinessPending} />
        <LinkItem
          to={`${url}/sharing`}
          label={t('Compartilhamento')}
          isDisabled={isBusinessPending}
        />
        <LinkItem
          to={`${url}/orders-history`}
          label={t('Histórico de pedidos')}
        />
        <LinkItem to={`${url}/finances`} label={t('Financeiro')} />
        <LinkItem to={`${url}/promotions`} label={t('Promoções')} />
      </Box>
      <Box mt="6">
        <Text ml="3" mb="2" fontSize="xs" fontWeight="700" color="gray.600">
          {t('CONFIGURAÇÕES')}
        </Text>
        <LinkItem to={`${url}/menu`} label={t('Cardápio')} />
        <LinkItem to={`${url}/business-schedules`} label={t('Horários')} />
        <LinkItem to={`${url}/delivery-area`} label={t('Área de entrega')} />
        <LinkItem
          to={`${url}/business-profile`}
          label={t('Perfil do restaurante')}
        />
        <LinkItem to={`${url}/operation`} label={t('Operação')} />
        <LinkItem to={`${url}/team`} label={t('Colaboradores')} />
        <LinkItem
          to={`${url}/banking-information`}
          label={t('Dados bancários')}
        />
        <LinkItem to={`${url}/logistics`} label={t('Plano')} />
        {!isLogistics ? (
          <LinkItem to={`${url}/fleet`} label={t('Entrega')} />
        ) : null}
        <LinkItem to={`${url}/integrations`} label={t('Integrações')} />
      </Box>
    </Box>
  );
};
