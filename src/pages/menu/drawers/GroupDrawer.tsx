import { useContextMenu } from 'app/state/menu/context';
import React from 'react';
import { useParams } from 'react-router-dom';
import { t } from 'utils/i18n';
import { BaseDrawer } from './BaseDrawer';
import { GroupForm } from './product/groups/GroupForm';

interface Props {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  groupId: string;
};

export const GroupDrawer = (props: Props) => {
  //context
  const { groupId } = useParams<Params>();
  const { getComplementsGroupById, updateComplementsGroup, updateGroupResult } = useContextMenu();
  const group = getComplementsGroupById(groupId);
  // UI
  return (
    <BaseDrawer
      {...props}
      title={groupId === 'new' ? t('Adicionar grupo') : t('Editar grupo')}
      type="group"
      headerMd="0"
      isError={updateGroupResult.isError}
      error={updateGroupResult.error}
    >
      <GroupForm
        isCreate
        atDrawer
        groupData={group}
        onSuccess={() => props.onClose()}
        updateComplementsGroup={updateComplementsGroup}
        updateGroupResult={updateGroupResult}
      />
    </BaseDrawer>
  );
};
