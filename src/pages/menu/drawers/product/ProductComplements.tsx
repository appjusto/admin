import { Button, Flex, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import * as menu from 'app/api/business/menu/functions';
import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import { ComplementGroup, MenuConfig, WithId } from 'appjusto-types';
import React from 'react';
import { useParams } from 'react-router-dom';
import { t } from 'utils/i18n';
import { GroupForm } from './groups/GroupForm';
import { Groups } from './groups/Groups';

interface Params {
  productId: string;
}

interface ProductComplementsProps {
  groups: WithId<ComplementGroup>[];
  productConfig: MenuConfig;
}

export const ProductComplements = ({ groups, productConfig }: ProductComplementsProps) => {
  const api = useContextApi();
  const { productId } = useParams<Params>();
  const businessId = useContextBusinessId();
  const [hasComplements, setHasComplements] = React.useState(false);
  const [newGroupForm, setNewGroupForm] = React.useState(false);

  React.useEffect(() => {
    if (groups?.length > 0) {
      setHasComplements(true);
    }
  }, [groups]);

  //handlers
  const onSaveComplementsGroup = async (group: ComplementGroup) => {
    (async () => {
      const { id: groupId } = await api.business().createComplementsGroup(businessId!, group);
      const newProductConfig = menu.addCategory(productConfig, groupId);
      await api.business().updateProduct(businessId!, productId, {
        complementsOrder: newProductConfig,
      });
      setNewGroupForm(false);
    })();
  };

  const onUpdateComplementsGroup = async (groupId: string, changes: Partial<ComplementGroup>) => {
    await api.business().updateComplementsGroup(businessId!, groupId, changes);
  };

  const onDeleteComplementsGroup = async (groupId: string) => {
    const newProductConfig = menu.removeCategory(productConfig, groupId);
    await api.business().updateProduct(businessId!, productId, {
      complementsOrder: newProductConfig,
    });
    await api.business().deleteComplementsGroup(businessId!, groupId);
  };

  const onDeleteComplement = async (complementId: string, groupId: string) => {
    const newProductConfig = menu.removeProductFromCategory(productConfig, complementId, groupId);
    await api.business().updateProduct(businessId!, productId, {
      complementsOrder: newProductConfig,
    });
    await api.business().deleteComplement(businessId!, complementId);
  };

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
      <Groups
        groups={groups}
        productConfig={productConfig}
        onUpdateGroup={onUpdateComplementsGroup}
        onDeleteGroup={onDeleteComplementsGroup}
        onDeleteComplement={onDeleteComplement}
      />
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
            <Button width="full" variant="outline" color="black" fontSize="15px">
              {t('Associar com grupo existente')}
            </Button>
          </Stack>
          {newGroupForm && <GroupForm submitGroup={onSaveComplementsGroup} isCreate />}
        </>
      )}
    </>
  );
};
