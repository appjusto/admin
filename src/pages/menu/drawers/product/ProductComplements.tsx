import { ComplementGroup, WithId } from '@appjusto/types';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Box,
  Button,
  CheckboxGroup,
  Flex,
  HStack,
  Link,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useContextMenu } from 'app/state/menu/context';
import CustomCheckbox from 'common/components/form/CustomCheckbox';
import CustomRadio from 'common/components/form/CustomRadio';
import { useProductContext } from 'pages/menu/context/ProductContext';
import React from 'react';
import {
  Link as RouterLink,
  Redirect,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import { slugfyName } from 'utils/functions';
import { t } from 'utils/i18n';

interface ComplementsGroupCardProps {
  group: WithId<ComplementGroup>;
}

const ComplementsGroupCard = ({ group }: ComplementsGroupCardProps) => {
  // context
  const router = useHistory();
  const { setIsProductPage } = useContextMenu();
  // handlers
  const makeGroupItemVisible = () => {
    setIsProductPage(false);
    router.push(`/app/menu?group=${group.id}`);
  };
  // UI
  return (
    <Flex
      w="100%"
      p="4"
      border="1px solid #D7E7DA"
      borderRadius="lg"
      justifyContent="space-between"
      alignItems="center"
    >
      <CustomCheckbox
        w="100%"
        value={group.id}
        isDisabled={group.items?.length === 0}
        aria-label={`${slugfyName(group.name)}-checkbox`}
      >
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
          <Text
            fontSize="sm"
            color={group.items?.length === 0 ? 'red' : 'gray.700'}
          >
            {group.items && group.items.length > 0
              ? `Itens: ${group.items.map((item) => item.name).join(', ')}`
              : 'Nenhum item cadastrado'}
          </Text>
        </Box>
      </CustomCheckbox>
      <Button
        w="160px"
        size="sm"
        fontSize="15px"
        variant="outline"
        onClick={makeGroupItemVisible}
      >
        {t('Ver detalhes')}
      </Button>
    </Flex>
  );
};

export const ProductComplements = () => {
  //context
  const { url } = useRouteMatch();
  const {
    productId,
    state,
    // handleProductUpdate,
    //connectComplmentsGroupToProduct,
    // connectionResult,
  } = useProductContext();
  const { product } = state;
  const { complementsGroupsWithItems } = useContextMenu();
  //state
  const [hasComplements, setHasComplements] = React.useState(false);
  const [connectedGroups, setConnectedGroups] = React.useState<string[]>([]);
  // helpers
  const complementsExists = complementsGroupsWithItems.length > 0;
  // handlers
  const handleComplementsEnable = (value: string) => {
    setHasComplements(value === 'complements-disabled' ? false : true);
  };
  // const handleComplementsGroupsConnection = () => {
  //   if (!hasComplements || connectedGroups.length === 0) {
  //     setHasComplements(false);
  //     handleProductUpdate({
  //       complementsEnabled: false,
  //       complementsGroupsIds: [],
  //     });
  //     return;
  //   }
  //   handleProductUpdate({
  //     complementsEnabled: true,
  //     complementsGroupsIds: connectedGroups,
  //   });
  // };
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
        value={hasComplements ? 'complements-enabled' : 'complements-disabled'}
        defaultValue="complements-disabled"
        colorScheme="green"
        color="black"
      >
        <Flex flexDir="column" justifyContent="flex-start">
          <CustomRadio mt="2" value="complements-disabled">
            {t('Não possui')}
          </CustomRadio>
          <CustomRadio
            mt="2"
            value="complements-enabled"
            isDisabled={!complementsExists}
          >
            {t('Sim, possui complementos')}
          </CustomRadio>
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
                <ComplementsGroupCard key={group.id} group={group} />
              ))}
            </Stack>
          </CheckboxGroup>
        </Box>
      )}
    </Box>
  );
};
