import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useContextMenu } from 'app/state/menu/context';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
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
  const [error, setError] = React.useState(initialError);
  // refs
  const submission = React.useRef(0);
  // handlers
  const handleComplementsEnable = (value: string) => {
    updateProduct({ changes: { complementsEnabled: value === '1' ? false : true } });
    setHasComplements(value === '1' ? false : true);
  };
  const handleComplementsGroupsConnection = () => {
    submission.current += 1;
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

  React.useEffect(() => {
    if (connectionResult.isError) {
      setError({
        status: true,
        error: connectionResult.error,
      });
    }
  }, [connectionResult.isError, connectionResult.error]);

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
          <Radio mt="2" value="1">
            {t('Não possui')}
          </Radio>
          <Radio mt="2" value="2">
            {t('Sim, possui complementos')}
          </Radio>
        </Flex>
      </RadioGroup>
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
                  <Checkbox
                    w="100%"
                    iconColor="white"
                    size="lg"
                    borderColor="gray.700"
                    value={group.id}
                  >
                    <Box ml="2">
                      <Text>{group.name}</Text>
                      <Text fontSize="sm" color="gray.700">{`${
                        group.required ? 'Obrigatório' : 'Opcional'
                      }. Mín: ${group.minimum}. Máx: ${group.maximum}`}</Text>
                      <Text fontSize="sm" color="gray.700">{`Itens: ${group.items
                        ?.map((item) => item.name)
                        .join(', ')}`}</Text>
                    </Box>
                  </Checkbox>
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
      <SuccessAndErrorHandler
        submission={submission.current}
        isSuccess={connectionResult.isSuccess}
        isError={error.status}
        error={error.error}
      />
    </Box>
  );
};
