import { Box, BoxProps } from '@chakra-ui/react';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { OnboardingItem } from './ChecklistItem';

export const Checklist = (props: BoxProps) => {
  const { path } = useRouteMatch();
  const segment = path.split('/').pop();
  const currentStepIndex = parseInt(segment ?? '1') - 1;
  const items = [
    t('Preencher dados pessoais do administrador'),
    t('Criar perfil do restaurante'),
    t('Cadastrar dados bancários'),
    t('Definir endereço e raio de entrega'),
    t('Incluir o cardápio'),
    t('Adicionar colaboradores')
  ];
  return (
    <Box {...props}>
      {items.map((item, i) => (
        <OnboardingItem key={item} mt={i > 0 ? "4" : "0"} text={item} checked={currentStepIndex > i} currentStep={currentStepIndex === i} />
      ))}
    </Box>
  );
}
