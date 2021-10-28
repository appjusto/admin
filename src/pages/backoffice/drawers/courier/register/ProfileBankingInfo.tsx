import { useContextCourierProfile } from 'app/state/courier/context';
import { BankingForm } from 'common/components/backoffice/BankingForm';
import React from 'react';

export const ProfileBankingInfo = () => {
  // context
  const { courier, handleProfileChange, setContextValidation } = useContextCourierProfile();
  // UI
  return (
    <BankingForm
      bankAccount={courier?.bankAccount}
      handleBankAccountChange={(newBankAccount) =>
        handleProfileChange('bankAccount', newBankAccount)
      }
      handleContextValidation={(validation) =>
        setContextValidation((prev) => ({ ...prev, validation }))
      }
    />
  );
};
