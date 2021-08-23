import { SelectProps } from '@chakra-ui/react';
import { useCuisines } from 'app/api/platform/useCuisines';
import { Select } from 'common/components/form/select/Select';
import React from 'react';
import { t } from 'utils/i18n';

export const CuisineSelect = (props: SelectProps) => {
  const cuisines = useCuisines();
  return (
    <Select
      label={t('Tipo de cozinha *')}
      placeholder={t('Selecione o tipo de cozinha oferecido')}
      {...props}
    >
      {cuisines.map((cuisine) => (
        <option key={cuisine.id} value={cuisine.name}>
          {cuisine.name}
        </option>
      ))}
    </Select>
  );
};
