import { useContextMenu } from 'app/state/menu/context';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'utils/functions';
import { t } from 'utils/i18n';
import { ComplementForm } from '../complements/ComplementForm';
import { BaseDrawer } from './BaseDrawer';

interface Props {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  complementId: string;
};

export const ComplementDrawer = (props: Props) => {
  //context
  const query = useQuery();
  const { complementId } = useParams<Params>();
  const {
    getComplementData,
    updateComplement,
    updateComplementResult,
    deleteComplement,
  } = useContextMenu();
  // state
  const [groupId, setGroupId] = React.useState<string>();
  const { group, complement } = getComplementData(complementId, groupId);
  // side effects
  React.useEffect(() => {
    if (!query) return;
    if (groupId) return;
    const paramsId = query.get('groupId');
    if (paramsId) setGroupId(paramsId);
  }, [query, groupId]);
  // UI
  return (
    <BaseDrawer
      {...props}
      title={complementId === 'new' ? t('Adicionar complemento') : t('Editar complemento')}
      type="complement"
      headerMd="0"
      isError={updateComplementResult.isError}
      error={updateComplementResult.error}
    >
      <ComplementForm
        groupId={groupId ?? group?.id}
        groupMaximum={group?.maximum}
        complementId={complementId}
        item={complement}
        updateComplement={updateComplement}
        updateComplementResult={updateComplementResult}
        onSuccess={props.onClose}
        deleteComplement={deleteComplement}
      />
    </BaseDrawer>
  );
};
