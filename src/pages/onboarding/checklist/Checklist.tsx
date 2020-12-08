import { Box, BoxProps } from '@chakra-ui/react';
import React from 'react';
import { t } from 'utils/i18n';
import { OnboardingItem } from './ChecklistItem';

export const Checklist = (props: BoxProps) => {
  return (
    <Box {...props}>
      <OnboardingItem text={t('Preencher dados pessoais do administrador')} checked />
      <OnboardingItem mt="4" text={t('Criar perfil do restaurante')} checked />
      <OnboardingItem mt="4" text={t('Cadastrar dados bancários')} checked />
      <OnboardingItem mt="4" text={t('Definir endereço e raio de entrega')} checked />
      <OnboardingItem mt="4" text={t('Incluir o cardápio')} checked />
      <OnboardingItem mt="4" text={t('Adicionar colaboradores')} />
    </Box>
  );
}
