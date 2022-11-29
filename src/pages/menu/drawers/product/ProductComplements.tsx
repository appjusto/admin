import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  CheckboxGroup,
  Flex,
  Link,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useContextMenu } from 'app/state/menu/context';
import { useProductContext } from 'pages/menu/context/ProductContext';
import React from 'react';
import { Link as RouterLink, Redirect, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import ComplementsGroupCard from './ComplementsGroupCard';

export const ProductComplements = () => {
  //context
  const { url } = useRouteMatch();
  const { productId, state, handleStateUpdate, handleProductUpdate } =
    useProductContext();
  const { product } = state;
  const { complementsGroupsWithItems } = useContextMenu();
  // helpers
  const complementsExists = complementsGroupsWithItems.length > 0;
  // side effects
  React.useEffect(() => {
    if (state.saveSuccess) {
      handleStateUpdate({ saveSuccess: false });
    }
  }, [state, handleStateUpdate]);
  // UI
  if (productId === 'new') {
    const urlRedirect = url.split('/complements')[0];
    return <Redirect to={urlRedirect} />;
  }
  return (
    <Box>
      <Text fontSize="xl" color="black">
        {t('Esse item possui complementos?')}
      </Text>
      <RadioGroup
        onChange={(value) =>
          handleProductUpdate({
            complementsEnabled: value === 'no' ? false : true,
          })
        }
        value={product.complementsEnabled ? 'yes' : 'no'}
        defaultValue="complements-disabled"
        colorScheme="green"
        color="black"
      >
        <Flex flexDir="column" justifyContent="flex-start">
          <Radio mt="2" value="no">
            {t('Não possui')}
          </Radio>
          <Radio mt="2" value="yes" isDisabled={!complementsExists}>
            {t('Sim, possui complementos')}
          </Radio>
        </Flex>
      </RadioGroup>
      {!complementsExists && (
        <Alert
          mt="4"
          status="warning"
          color="black"
          border="1px solid #FFBE00"
          borderRadius="lg"
        >
          <AlertIcon />
          <Flex flexDir="column">
            <AlertDescription>
              {t(
                'Antes de associar um grupo de complementos a um produto, você precisa '
              )}
              <Link
                as={RouterLink}
                to="/app/menu/complementsgroup/new"
                textDecor="underline"
              >
                {t('cadastrar um grupo de complementos')}.
              </Link>
            </AlertDescription>
          </Flex>
        </Alert>
      )}
      {product.complementsEnabled && (
        <Box mt="6">
          <Text fontSize="xl" color="black" fontWeight="700">
            {t('Selecione os grupos que deseja associar a este produto:')}
          </Text>
          <CheckboxGroup
            colorScheme="green"
            value={product.complementsGroupsIds}
            onChange={(values: string[]) =>
              handleProductUpdate({ complementsGroupsIds: values })
            }
          >
            <Stack
              mt="4"
              direction="column"
              alignItems="flex-start"
              color="black"
              spacing={2}
              fontSize="16px"
              lineHeight="22px"
            >
              {complementsGroupsWithItems.map((group) => (
                <ComplementsGroupCard key={group.id} group={group} />
              ))}
            </Stack>
          </CheckboxGroup>
        </Box>
      )}
    </Box>
  );
};
