import { Button, Flex, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import { ComplementGroup, MenuConfig, WithId } from 'appjusto-types';
import React from 'react';
import { t } from 'utils/i18n';
import { GroupForm, NewGroup } from './groups/GroupForm';
import { Groups } from './groups/Groups';

interface ProductComplementsProps {
  onSaveGroup(group: ComplementGroup): void;
  onUpdateGroup(groupId: string, changes: Partial<ComplementGroup>): Promise<void>;
  onDeleteGroup(groupId: string): Promise<void>;
  groups: WithId<ComplementGroup>[];
  productConfig: MenuConfig;
}

export const ProductComplements = ({
  groups,
  productConfig,
  onSaveGroup,
  onUpdateGroup,
  onDeleteGroup,
}: ProductComplementsProps) => {
  const [hasComplements, setHasComplements] = React.useState(false);
  const [newGroupForm, setNewGroupForm] = React.useState(false);

  React.useEffect(() => {
    if (groups?.length > 0) {
      setHasComplements(true);
    }
  }, [groups]);

  //handlers
  const saveGroup = (newGroup: NewGroup) => {
    onSaveGroup(newGroup);
    setNewGroupForm(false);
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
        onUpdateGroup={onUpdateGroup}
        onDeleteGroup={onDeleteGroup}
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
          {newGroupForm && <GroupForm submitGroup={saveGroup} isCreate />}
        </>
      )}
    </>
  );
};
