import { Box, BoxProps } from '@chakra-ui/react';
import { useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { LinkItem } from './LinkItem';

export const BackOfficeLinks = (props: BoxProps) => {
  // context
  const { url } = useRouteMatch();
  // UI
  return (
    <Box mt="10" {...props}>
      <LinkItem type="backoffice" to={`${url}`} label={t('Visão geral')} />
      <LinkItem type="backoffice" to={`${url}/orders`} label={t('Pedidos')} />
      <LinkItem type="backoffice" to={`${url}/couriers`} label={t('Entregadores')} />
      <LinkItem type="backoffice" to={`${url}/businesses`} label={t('Restaurantes')} />
      <LinkItem type="backoffice" to={`${url}/consumers`} label={t('Consumidores')} />
      <LinkItem type="backoffice" to={`${url}/invoices`} label={t('Faturas')} />
      <LinkItem type="backoffice" to={`${url}/users`} label={t('Usuários')} />
      <LinkItem type="backoffice" to={`${url}/recommendations`} label={t('Indicações')} />
      <LinkItem type="backoffice" to={`${url}/fraud-prevention`} label={t('Antifraude')} />
      <LinkItem type="backoffice" to={`${url}/staff`} label={t('Agentes')} />
      <LinkItem type="backoffice" to={`${url}/platform`} label={t('Parâmetros')} />
    </Box>
  );
};
