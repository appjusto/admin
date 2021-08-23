import { SelectProps } from '@chakra-ui/react';
import { useBanks } from 'app/api/platform/useBanks';
import { Select } from 'common/components/form/select/Select';
import React from 'react';
import { t } from 'utils/i18n';

export const BankSelect = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ ...props }: SelectProps, ref) => {
    const banks = useBanks();
    return (
      <Select ref={ref} label={t('Banco *')} placeholder={t('Selecione seu banco')} {...props}>
        {banks.map((bank) => (
          <option key={bank.id} value={bank.name}>
            {bank.name}
          </option>
        ))}
      </Select>
    );
  }
);
