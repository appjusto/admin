import { useContextBusinessBackoffice } from 'app/state/business/businessBOContext';
import { BankingForm } from 'common/components/backoffice/BankingForm';

const BOBankingInformation = () => {
  // context
  const { bankAccount, handleBankingInfoChange, setContextValidation } =
    useContextBusinessBackoffice();
  // UI
  return (
    <BankingForm
      bankAccount={bankAccount}
      handleBankAccountChange={(newBankAccount) =>
        handleBankingInfoChange(newBankAccount)
      }
      handleContextValidation={(validation) =>
        setContextValidation((prev) => ({ ...prev, validation }))
      }
    />
  );
};

export default BOBankingInformation;
