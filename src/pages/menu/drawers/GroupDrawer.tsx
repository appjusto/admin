import { useContextMenu } from 'app/state/menu/context';
import React from 'react';
import { useParams } from 'react-router-dom';
import { t } from 'utils/i18n';
import { GroupForm } from '../complements/GroupForm';
import { BaseDrawer } from './BaseDrawer';

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
  const { getComplementsGroupById, isProductsPage, setIsProductPage } = useContextMenu();
  const group = getComplementsGroupById(groupId);
  // side effects
  React.useEffect(() => {
    if (isProductsPage) setIsProductPage(false);
  }, [isProductsPage, setIsProductPage]);
  // UI
  return (
    <BaseDrawer
      {...props}
      title={groupId === 'new' ? t('Adicionar grupo') : t('Editar grupo')}
      type="group"
      headerMd="0"
    >
      <GroupForm atDrawer groupId={groupId} groupData={group} onSuccess={props.onClose} />
    </BaseDrawer>
  );
};
