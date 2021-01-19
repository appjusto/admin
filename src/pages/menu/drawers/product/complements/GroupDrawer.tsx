import { Button, Flex, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import { Complement, ComplementGroup, WithId } from 'appjusto-types';
import React from 'react';
import { t } from 'utils/i18n';
import { GroupBox } from './groups/GroupBox';
import { GroupForm, NewGroup } from './groups/GroupForm';

interface GroupDrawerProps {
  onSaveGroup(group: ComplementGroup): void;
  groups: WithId<ComplementGroup>[];
  complements: WithId<Complement>[];
}

export const GroupDrawer = ({ groups, complements, onSaveGroup }: GroupDrawerProps) => {
  const [hasComplements, setHasComplements] = React.useState(false);
  const [newGroupForm, setNewGroupForm] = React.useState(false);

  React.useEffect(() => {
    if (groups?.length > 0) {
      setHasComplements(true);
    }
  }, [groups, complements]);

  //handlers
  const createNewGroup = (newGroup: NewGroup) => {
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
      {groups?.length > 0 &&
        groups.map((group) => <GroupBox group={group} updateGroup={createNewGroup} />)}
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
          {newGroupForm && <GroupForm submitGroup={createNewGroup} isCreate />}
        </>
      )}
    </>
  );
};
