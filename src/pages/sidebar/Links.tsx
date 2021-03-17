import { Box, Text } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import { Pendency } from 'common/components/Pendency';
import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';

interface LinkItemProps {
  to: string;
  children: React.ReactElement;
}

const LinkItem = ({ to, children }: LinkItemProps) => {
  let match = useRouteMatch({
    path: to,
    exact: true,
  });
  return (
    <Box
      d="flex"
      alignItems="center"
      bg={match ? 'white' : ''}
      fontSize="sm"
      fontWeight={match ? '700' : ''}
      pl={match ? '0' : '4'}
      mt="1"
      height="32px"
    >
      {match ? <Box w="4px" height="100%" bg="green.500" borderRadius="8px" mx="2" /> : null}
      {children}
    </Box>
  );
};

interface LinksContainerProps {
  children: React.ReactElement | React.ReactElement[];
}

const LinksContainer = ({ children }: LinksContainerProps) => {
  return (
    <>
      {React.Children.map(children, (child) => {
        return <LinkItem {...child.props}>{child}</LinkItem>;
      })}
    </>
  );
};

export const Links = () => {
  // context
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
          <Link to={`${url}/orders-history`}>{t('Histórico de pedidos')}</Link>
          <Link to="/">
            {t('Financeiro')}
            <Pendency />
          </Link>
          <Link to={`${url}/business-profile`}>{t('Perfil do restaurante')}</Link>
          <Link to="/">
            {t('Colaboradores')}
            <Pendency />
          </Link>
        </LinksContainer>
      </Box>
    </Box>
  );
};
