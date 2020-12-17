import { Box } from '@chakra-ui/react';
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
      fontWeight={match ? '700' : ''}
      pl={match ? '0' : '4'}
      my="4"
    >
      {match ? <Box w="4px" height="32px" bg="green.500" borderRadius="8px" mx="2" /> : null}
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
  return (
    <Box ml="1">
      <Box>
        <LinksContainer>
          <Link to="/home">{t('Início')}</Link>
          <Link to="/orders">{t('Pedidos')}</Link>
          <Link to="/">{t('Financeiro')}</Link>
        </LinksContainer>
      </Box>
      <Box mt="10">
        <LinksContainer>
          <Link to="/menu">{t('Cardápio')}</Link>
          <Link to="/">{t('Horários')}</Link>
          <Link to="/delivery-area">{t('Área de entrega')}</Link>
          <Link to="/business-profile">{t('Perfil do restaurante')}</Link>
          <Link to="/banking">{t('Informações bancárias')}</Link>
        </LinksContainer>
      </Box>
    </Box>
  );
};
