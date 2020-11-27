import { Select, SelectProps } from '@chakra-ui/react';
import { useCategories } from 'app/state/menu/categories';
import React from 'react';
import { t } from 'utils/i18n';
import { ReactComponent as SelectIcon } from './select-arrow.svg';

interface Props extends SelectProps {}

export const CategorySelect = (props: Props) => {
  const categories = useCategories();
  return (
    <Select
      variant="outline"
      size="lg"
      icon={<SelectIcon />}
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
