export type OnboardingStep = '1' | '2' | '3' | '4' | '5' | 'complete';
export interface OnboardingProps {
  onboarding?: OnboardingStep;
  redirect?: string;
}
