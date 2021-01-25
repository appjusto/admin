import { Text } from '@chakra-ui/react';
import { useProductContext } from 'pages/menu/context/ProductContext';
import React from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';

export const ProductAvailability = () => {
  //context
  const { url } = useRouteMatch();
  const { productId } = useProductContext();
  //state

  if (productId === 'new') {
    const urlRedirect = url.split('/availability')[0];
    return <Redirect to={urlRedirect} />;
  }

  return (
    <>
      <Text fontSize="xl" color="black">
        {t('Dias e horários')}
      </Text>
      <Text fontSize="sm">
        {t('Defina quais os dias e horários seus clientes poderão comprar esse ítem')}
      </Text>
    </>
  );
};
