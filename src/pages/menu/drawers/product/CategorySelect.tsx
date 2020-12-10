import { SelectProps } from '@chakra-ui/react';
import { useContextCategories } from 'app/state/menu/categories';
import { Select } from 'common/components/form/select/Select';
import React from 'react';
import { t } from 'utils/i18n';

interface Props extends SelectProps {}

export const CategorySelect = (props: Props) => {
  const categories = useContextCategories();
  return (
    <Select label={t('Categoria')} placeholder={t('Selecione uma categoria')} {...props}>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </Select>
  );
};
