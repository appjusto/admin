import { SelectProps } from '@chakra-ui/react';
import { useContextMenu } from 'app/state/menu/context';
import { Select } from 'common/components/form/select/Select';
import React from 'react';
import { t } from 'utils/i18n';

export const GroupSelect = (props: SelectProps) => {
  const { complementsGroups } = useContextMenu();
  return (
    <Select label={t('Grupo de complementos')} placeholder={t('Selecione um grupo')} {...props}>
      {complementsGroups.map((group) => (
        <option key={group.id} value={group.id}>
          {group.name}
        </option>
      ))}
    </Select>
  );
};
