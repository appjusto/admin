import { Center } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { ReactComponent as Logo } from 'common/img/logo.svg';
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

  if (isSuccess) return <Redirect to="/home" />;
  return (
    <Center height="100vh">
      <Logo />
    </Center>
  );
};
