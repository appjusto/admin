import { Button, Flex, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import { useProductContext } from 'pages/menu/context/ProductContext';
import React from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { GroupForm } from './groups/GroupForm';
import { Groups } from './groups/Groups';

export const ProductComplements = () => {
  //context
  const { url } = useRouteMatch();
  const { productId, sortedGroups, onSaveComplementsGroup } = useProductContext();
  //state
  const [hasComplements, setHasComplements] = React.useState(false);
  const [newGroupForm, setNewGroupForm] = React.useState(false);

  React.useEffect(() => {
    if (sortedGroups?.length > 0) {
      setHasComplements(true);
    }
  }, [sortedGroups]);

  if (productId === 'new') {
    const urlRedirect = url.split('/complements')[0];
    return <Redirect to={urlRedirect} />;
  }

  return (
    <>
      <Text fontSize="xl" color="black">
        {t('Esse item possui complementos?')}
      </Text>
      <RadioGroup
        onChange={(value) => setHasComplements(value === '1' ? false : true)}
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
      <Groups />
      {hasComplements && (
        <>
          <Stack mt="8" mb="10" spacing={4} direction="row">
            <Button
              width="full"
              color="black"
              fontSize="15px"
              onClick={() => setNewGroupForm(true)}
            >
              {t('Criar novo grupo de complementos')}
            </Button>
            <Button isDisabled width="full" variant="outline" color="black" fontSize="15px">
              {t('Associar com grupo existente')}
            </Button>
          </Stack>
          {newGroupForm && (
            <GroupForm
              submitGroup={onSaveComplementsGroup}
              isCreate
              onSuccess={() => setNewGroupForm(false)}
            />
          )}
        </>
      )}
    </>
  );
};
