import {
  Badge,
  Box,
  Button,
  CheckboxGroup,
  Flex,
  HStack,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useContextMenu } from 'app/state/menu/context';
import { AlertWarning } from 'common/components/AlertWarning';
import CustomCheckbox from 'common/components/form/CustomCheckbox';
import CustomRadio from 'common/components/form/CustomRadio';
import { useProductContext } from 'pages/menu/context/ProductContext';
import React from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';

export const ProductComplements = () => {
  //context
  const { url } = useRouteMatch();
  const {
    productId,
    product,
    updateProduct,
    connectComplmentsGroupToProduct,
    connectionResult,
  } = useProductContext();
  const { complementsGroupsWithItems } = useContextMenu();
  const { isLoading } = connectionResult;
  //state
  const [hasComplements, setHasComplements] = React.useState(false);
  const [connectedGroups, setConnectedGroups] = React.useState<string[]>([]);
  // helpers
  const complementsExists = complementsGroupsWithItems.length > 0;
  // handlers
  const handleComplementsEnable = (value: string) => {
    updateProduct({ changes: { complementsEnabled: value === '1' ? false : true } });
    setHasComplements(value === '1' ? false : true);
  };
  const handleComplementsGroupsConnection = () => {
    connectComplmentsGroupToProduct({ groupsIds: connectedGroups });
  };
  // side effects
  React.useEffect(() => {
    if (product?.complementsEnabled) {
      setHasComplements(true);
    }
  }, [product?.complementsEnabled]);
  React.useEffect(() => {
    if (product?.complementsGroupsIds) {
      setConnectedGroups(product?.complementsGroupsIds);
    }
  }, [product?.complementsGroupsIds]);
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
        onChange={(value) => handleComplementsEnable(value.toString())}
        value={hasComplements ? '2' : '1'}
        defaultValue="1"
        colorScheme="green"
        color="black"
      >
        <Flex flexDir="column" justifyContent="flex-start">
          <CustomRadio mt="2" value="1">
            {t('Não possui')}
          </CustomRadio>
          <CustomRadio mt="2" value="2" isDisabled={!complementsExists}>
            {t('Sim, possui complementos')}
          </CustomRadio>
        </Flex>
      </RadioGroup>
      {!complementsExists && (
        <AlertWarning mt="8" title={t('Você ainda não cadastrou complementos')} />
      )}
      {hasComplements && (
        <Box mt="6">
          <Text fontSize="xl" color="black" fontWeight="700">
            {t('Selecione os grupos que deseja associar a este produto:')}
          </Text>
          <CheckboxGroup
            colorScheme="green"
            value={connectedGroups}
            onChange={(values: string[]) => setConnectedGroups(values)}
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
                <Box key={group.id} w="100%" p="4" border="1px solid #D7E7DA" borderRadius="lg">
                  <CustomCheckbox w="100%" value={group.id}>
                    <Box ml="2">
                      <HStack spacing={2}>
                        <Text>{group.name}</Text>
                        {!group.enabled && (
                          <Badge px="2" borderRadius="lg">
                            {t('Indisponível')}
                          </Badge>
                        )}
                      </HStack>
                      <Text fontSize="sm" color="gray.700">{`${
                        group.required ? 'Obrigatório' : 'Opcional'
                      }. Mín: ${group.minimum}. Máx: ${group.maximum}`}</Text>
                      <Text fontSize="sm" color="gray.700">{`Itens: ${group.items
                        ?.map((item) => item.name)
                        .join(', ')}`}</Text>
                    </Box>
                  </CustomCheckbox>
                </Box>
              ))}
            </Stack>
          </CheckboxGroup>
          <Button
            mt="6"
            width={{ base: '100%', lg: '50%' }}
            color="black"
            fontSize="15px"
            onClick={handleComplementsGroupsConnection}
            isLoading={isLoading}
          >
            {t('Salvar grupos associados')}
          </Button>
        </Box>
      )}
    </Box>
  );
};
