import { Box, Button, Stack } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextMenu } from 'app/state/menu/context';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { t } from 'utils/i18n';
import { BaseDrawer } from './BaseDrawer';

interface Props {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  groupId: string;
};

export const GroupDuplicationDrawer = (props: Props) => {
  //context
  const { groupId } = useParams<Params>();
  const { cloneComplementsGroup, cloneGroupResult } = useBusinessProfile();
  const { getComplementsGroupById } = useContextMenu();
  // state
  const [currentGroupName, setCurrentGroupName] = React.useState<string>();
  const [name, setName] = React.useState('');
  const [newGoupId, setNewGoupId] = React.useState<string>();
  // refs
  const inputRef = React.useRef<HTMLInputElement>(null);
  // handlers
  const handleSubmit = async () => {
    let groupData = { groupId } as { groupId: string; name?: string };
    if (name.length > 0 && name !== currentGroupName) groupData.name = name;
    const id = await cloneComplementsGroup(groupData);
    if (id) setNewGoupId(id);
  };
  // side effects
  React.useEffect(() => {
    inputRef?.current?.focus();
  }, []);
  React.useEffect(() => {
    const currentGroup = getComplementsGroupById(groupId);
    if (currentGroup) {
      setCurrentGroupName(currentGroup.name);
      setName((prev) => {
        if (prev.length === 0) return currentGroup.name;
        else return prev;
      });
    }
  }, [groupId, getComplementsGroupById]);
  // React.useEffect(() => {
  //   if (!newGoupId) return;
  //   setTimeout(() => push(), 1000);
  // }, [newGoupId, push]);
  // UI
  if (newGoupId) return <Redirect to={`/app/menu?group=${newGoupId}`} />;
  return (
    <BaseDrawer {...props} title={t('Duplicar grupo')} type="group" headerMd="0">
      <Box>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            handleSubmit();
          }}
        >
          <Input
            ref={inputRef}
            id="complements-group-name"
            label="Nome do novo grupo"
            placeholder="Nome do grupo"
            value={name}
            handleChange={(ev) => setName(ev.target.value)}
          />
          <Stack mt="8" spacing={4} direction="row">
            <Button
              type="submit"
              width="full"
              maxW="50%"
              isLoading={cloneGroupResult.isLoading}
              loadingText={t('Salvando')}
            >
              {t('Duplicar')}
            </Button>
            <Button width="full" variant="dangerLight" ml={3} onClick={props.onClose}>
              {t(`Cancelar`)}
            </Button>
          </Stack>
        </form>
      </Box>
    </BaseDrawer>
  );
};
