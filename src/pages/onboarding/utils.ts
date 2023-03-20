import { OnboardingStep } from './types';

export const isNewValidOnboardingStep = (
  currentStep?: OnboardingStep | number,
  savedStep?: string,
  limit?: number
) => {
  console.log('currentStep', currentStep);
  console.log('savedStep', savedStep);
  if (!currentStep || !savedStep) return false;
  const currentIndex =
    typeof currentStep === 'number'
      ? currentStep
      : parseInt(currentStep as string, 10);
  if (limit && currentIndex <= limit) return false;
  if (savedStep === 'complete' || parseInt(savedStep, 10) > currentIndex)
    return false;
  return true;
};
