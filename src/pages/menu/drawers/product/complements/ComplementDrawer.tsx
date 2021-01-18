import { Text } from '@chakra-ui/react';
import React from 'react';
import { t } from 'utils/i18n';
import { NewComplementForm } from './NewComplementForm';

interface ComplementDrawerProps {
  //onSaveComplement(complement: Complement): string;
  onSaveComplement(): void;
}

export const ComplementDrawer = ({ onSaveComplement }: ComplementDrawerProps) => {
  return (
    <>
      <Text fontSize="2xl" color="black">
        {t('Nome do grupo de complementos')}
      </Text>
      <Text mb="8" fontSize="sm">
        {t('Obrigatório, mínimo (1), máximo (3)')}
      </Text>
      <NewComplementForm />
    </>
  );
};
