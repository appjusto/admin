import { useContextMenu } from 'app/state/menu/context';
import React from 'react';
import { useParams } from 'react-router-dom';
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
  const { complementId } = useParams<Params>();
  const {
    getComplementById,
    getComplementsGroupByComplementId,
    updateComplement,
    updateComplementResult,
  } = useContextMenu();
  const complement = getComplementById(complementId);
  const group = getComplementsGroupByComplementId(complementId);
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
        groupMaximum={group?.maximum}
        complementId={complementId}
        item={complement}
        updateComplement={updateComplement}
        updateComplementResult={updateComplementResult}
        onSuccess={props.onClose}
        onCancel={props.onClose}
      />
    </BaseDrawer>
  );
};
