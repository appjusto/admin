import { OnboardingStep } from './types';

export const isNewValidOnboardingStep = (
  currentStep?: OnboardingStep | number,
  savedStep?: string,
  limit?: number
) => {
  if (!currentStep) return false;
  const currentIndex =
    typeof currentStep === 'number'
      ? currentStep
      : parseInt(currentStep as string, 10);
  if (limit && currentIndex <= limit) return false;
  if (
    savedStep === 'complete' ||
    (savedStep && parseInt(savedStep, 10) > currentIndex)
  )
    return false;
  return true;
};
