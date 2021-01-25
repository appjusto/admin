import { Flex, Radio, RadioGroup, Text } from '@chakra-ui/react';
import { useProductContext } from 'pages/menu/context/ProductContext';
import React from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';

export const ProductAvailability = () => {
  //context
  const { url } = useRouteMatch();
  const { productId } = useProductContext();
  //state
  const [mainAvailability, setMainAvailability] = React.useState<string>('1');

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
      <RadioGroup
        onChange={(value) => setMainAvailability(value.toString())}
        value={mainAvailability}
        defaultValue="1"
        colorScheme="green"
        color="black"
      >
        <Flex flexDir="column" justifyContent="flex-start">
          <Radio mt="2" value="1">
            {t('Sempre disponível quando o restaurante aberto')}
          </Radio>
          <Radio mt="2" value="2">
            {t('Disponível em dias e horários específicos')}
          </Radio>
        </Flex>
      </RadioGroup>
    </>
  );
};
