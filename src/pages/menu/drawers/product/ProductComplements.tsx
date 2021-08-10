import { Button, Flex, HStack, Radio, RadioGroup, Text } from '@chakra-ui/react';
import { useProductContext } from 'pages/menu/context/ProductContext';
import React from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { GroupForm } from './groups/GroupForm';
import { Groups } from './groups/Groups';

export const ProductComplements = () => {
  //context
  const { url } = useRouteMatch();
  const { productId, product, updateProduct } = useProductContext();
  //state
  const [hasComplements, setHasComplements] = React.useState(false);
  const [newGroupForm, setNewGroupForm] = React.useState(false);

  const handleComplementsEnable = (value: string) => {
    updateProduct({ changes: { complementsEnabled: value === '1' ? false : true } });
    setHasComplements(value === '1' ? false : true);
  };

  React.useEffect(() => {
    if (product?.complementsEnabled) {
      setHasComplements(true);
    }
  }, [product?.complementsEnabled]);

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
      <Groups />
      {hasComplements && (
        <>
          <HStack mt="8" mb="10" spacing={4}>
            <Button
              width={{ base: '100%', lg: '50%' }}
              color="black"
              fontSize="15px"
              onClick={() => setNewGroupForm(true)}
            >
              {t('Criar novo grupo de complementos')}
            </Button>
            {/*<Button isDisabled width="full" variant="outline" color="black" fontSize="15px">
              {t('Associar com grupo existente')}
              </Button>*/}
          </HStack>
          {/*<HStack spacing={4}>
            <Select
              mt="0"
              w="100%"
              label={t('Grupos de complementos')}
              placeholder={t('Selecione um grupo existente')}
            >
              {options.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </Select>
            <Button w={{ base: '100%', lg: '260px' }} h="60px" color="black" fontSize="15px">
              {t('Associar')}
            </Button>
              </HStack>*/}
          {newGroupForm && <GroupForm isCreate onSuccess={() => setNewGroupForm(false)} />}
        </>
      )}
    </>
  );
};
