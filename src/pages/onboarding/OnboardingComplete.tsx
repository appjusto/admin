import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextBusiness } from 'app/state/business/context';
import { Loading } from 'common/components/Loading';
import React from 'react';
import { Redirect } from 'react-router-dom';

export const OnboardingComplete = () => {
  // context
  const { business } = useContextBusiness();
  const { updateBusinessProfile, updateResult } = useBusinessProfile(true);
  const { isError } = updateResult;
  React.useEffect(() => {
    updateBusinessProfile({
      onboarding: 'completed',
    });
  }, [updateBusinessProfile]);
  if (isError) return <Redirect to="/onboarding/5" />;
  if (business?.onboarding === 'completed') return <Redirect to="/app" />;
  return <Loading />;
};
