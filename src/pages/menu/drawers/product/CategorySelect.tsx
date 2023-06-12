import { SelectProps } from '@chakra-ui/react';
import { useContextMenu } from 'app/state/menu/context';
import { Select } from 'common/components/form/select/Select';
import React from 'react';
import { t } from 'utils/i18n';

export const CategorySelect = (props: SelectProps) => {
  const { categories } = useContextMenu();
  return (
    <Select
      label={t('Categoria *')}
      placeholder={t('Selecione uma categoria')}
      {...props}
    >
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </Select>
  );
};
