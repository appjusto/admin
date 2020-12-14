import { Box, BoxProps } from '@chakra-ui/react';
import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { OnboardingItem } from './ChecklistItem';

export const Checklist = (props: BoxProps) => {
  const { path } = useRouteMatch();
  const segments = path.split('/');
  const lastSegment = segments.pop();
  const currentStepIndex = parseInt(lastSegment ?? '1') - 1;
  const items = [
    t('Preencher dados pessoais do administrador'),
    t('Criar perfil do restaurante'),
    t('Cadastrar dados bancários'),
    t('Definir endereço e raio de entrega'),
    t('Incluir o cardápio'),
    // t('Adicionar colaboradores')
  ];
  return (
    <Box {...props}>
      {items.map((item, i) => (
        <Link key={item} to={`/onboarding/${i + 1}`}>
          <OnboardingItem
            mt={i > 0 ? '4' : '0'}
            text={item}
            checked={currentStepIndex > i}
            currentStep={currentStepIndex === i}
          />
        </Link>
      ))}
    </Box>
  );
};
