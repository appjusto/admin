import { Input } from 'common/components/Input';
import React from 'react';
import { useParams } from 'react-router-dom';
import { t } from 'utils/i18n';
import { BaseDrawer } from './BaseDrawer';

interface Props {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  id: string;
};

export const CategoryDrawer = (props: Props) => {
  let { id } = useParams<Params>();
  console.log(id);
  const inputRef = React.useRef<HTMLInputElement>(null);
  // handlers
  const onSaveHandler = () => {
    (async () => {
      // TODO async work
      props.onClose();
    })();
  };

  // UI
  return (
    <BaseDrawer
      {...props}
      title={t('Adicionar categoria')}
      initialFocusRef={inputRef}
      onSave={onSaveHandler}
    >
      <Input ref={inputRef} label={t('Nova categoria')} placeholder={t('Nome da categoria')} />
    </BaseDrawer>
  );
};
