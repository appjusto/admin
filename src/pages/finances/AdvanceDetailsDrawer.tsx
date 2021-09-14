import { Text } from '@chakra-ui/react';
import React from 'react';
import { t } from 'utils/i18n';
import { FinancesBaseDrawer } from './FinancesBaseDrawer';

interface AdvanceDetailsDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

export const AdvanceDetailsDrawer = ({ onClose, ...props }: AdvanceDetailsDrawerProps) => {
  // context

  // handlers

  // side effects

  // UI
  return (
    <FinancesBaseDrawer
      onClose={onClose}
      title={t('Detalhes da antecipação')}
      isReviewing={false}
      setIsReviewing={() => {}}
      {...props}
    >
      <Text mt="2" fontSize="24px" fontWeight="500" lineHeight="30px" color="black">
        {t('Antecipação realizada com sucesso!')}
      </Text>
    </FinancesBaseDrawer>
  );
};
