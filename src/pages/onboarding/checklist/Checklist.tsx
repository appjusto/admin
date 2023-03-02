import { Box, BoxProps } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextBusiness } from 'app/state/business/context';
import React from 'react';
import { Link } from 'react-router-dom';
import { t } from 'utils/i18n';
import { OnboardingItem } from './ChecklistItem';

interface ChecklistProps extends BoxProps {
  disabled?: boolean;
  currentStepIndex: number;
}

export const Checklist = ({
  currentStepIndex,
  disabled,
  ...props
}: ChecklistProps) => {
  // context
  const { business } = useContextBusiness();
  const { updateBusinessProfile } = useBusinessProfile(business?.id, true);

  // state
  const [isDisabled, setIsDisabled] = React.useState(true);
  // side effects
  React.useEffect(() => {
    if (disabled || !business?.onboarding) return;
    if (parseInt(business.onboarding, 10) > 2) setIsDisabled(false);
  }, [disabled, business?.onboarding]);
  React.useEffect(() => {
    if (disabled) return;
    if (currentStepIndex > 2) {
      updateBusinessProfile({
        onboarding: String(currentStepIndex),
      });
    }
  }, [disabled, currentStepIndex, updateBusinessProfile]);
  // UI
  const items = [
    t('Preencher dados pessoais do administrador'),
    t('Criar perfil do restaurante'),
    t('Cadastrar dados bancários'),
    t('Definir endereço e raio de entrega'),
    t('Escolher modelo de logística'),
    t('Escolher modelo de cobertura'),
    t('Confirmar contrato de serviço e termos de uso'),
  ];
  return (
    <Box {...props}>
      {items.map((item, i) => {
        const onboardingItem = (
          <OnboardingItem
            key={item}
            mt={i > 0 ? '4' : '0'}
            text={item}
            checked={currentStepIndex > i + 1}
            currentStep={currentStepIndex === i + 1}
          />
        );
        return isDisabled ? (
          onboardingItem
        ) : (
          <Link key={item} to={`/onboarding/${i + 1}`}>
            {onboardingItem}
          </Link>
        );
      })}
    </Box>
  );
};
