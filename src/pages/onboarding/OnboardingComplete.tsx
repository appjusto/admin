import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { Loading } from 'common/components/Loading';
import React from 'react';
import { Redirect } from 'react-router-dom';

export const OnboardingComplete = () => {
  const { updateBusinessProfile, updateResult } = useBusinessProfile();
  const { isSuccess } = updateResult;
  React.useEffect(() => {
    updateBusinessProfile({
      onboarding: 'completed',
    });
  }, [updateBusinessProfile]);

  if (isSuccess) return <Redirect to="/app" />;
  return <Loading />;
};
