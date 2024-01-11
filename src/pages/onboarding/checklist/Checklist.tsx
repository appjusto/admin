import { Box, BoxProps } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextBusiness } from 'app/state/business/context';
import React from 'react';
import { Link } from 'react-router-dom';
import { t } from 'utils/i18n';
import { isNewValidOnboardingStep } from '../utils';
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
  // helpers
  const shouldUpdate = React.useMemo(
    () => isNewValidOnboardingStep(currentStepIndex, business?.onboarding, 2),
    [currentStepIndex, business?.onboarding]
  );
  // handlers
  const getLinkStatus = React.useCallback(
    (elementIndex: number) =>
      isNewValidOnboardingStep(elementIndex, business?.onboarding),
    [business?.onboarding]
  );
  // side effects
  React.useEffect(() => {
    if (disabled) return;
    if (shouldUpdate) {
      updateBusinessProfile({
        onboarding: currentStepIndex.toString(),
      });
    }
  }, [disabled, shouldUpdate, updateBusinessProfile, currentStepIndex]);
  // UI
  const items = [
    t('Dados pessoais do administrador'),
    t('Dados do restaurante'),
    t('Dados bancários'),
    t('Endereço e raio de entrega'),
    t('Plano de contratação'),
    t('Compromissos'),
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
        return getLinkStatus(i) ? (
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
