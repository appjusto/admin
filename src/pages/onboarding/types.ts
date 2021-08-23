export type OnboardingStep = '1' | '2' | '3' | '4' | 'complete';
export interface OnboardingProps {
  onboarding?: OnboardingStep;
  redirect?: string;
}
