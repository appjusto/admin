import { Box, Flex } from '@chakra-ui/react';
import { useBusinessBankAccount } from 'app/api/business/profile/useBusinessBankAccount';
import { BankAccount } from 'appjusto-types';
import { CustomNumberInput as NumberInput } from 'common/components/form/input/CustomNumberInput';
import { BankSelect } from 'common/components/form/select/BankSelect';
import { OnboardingProps } from 'pages/onboarding/types';
import PageFooter from 'pages/PageFooter';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';

const BankingInformation = ({ onboarding, redirect }: OnboardingProps) => {
  // context
  const { bankAccount, updateBankAccount, updateResult } = useBusinessBankAccount();
  const { isLoading, isSuccess } = updateResult;

  // state
  const [name, setName] = React.useState(bankAccount?.name ?? '');
  const [agency, setAgency] = React.useState(bankAccount?.agency ?? '');
  const [account, setAccount] = React.useState(bankAccount?.account ?? '');

  // refs
  const nameRef = React.useRef<HTMLInputElement>(null);

  // side effects
  React.useEffect(() => {
    nameRef?.current?.focus();
  }, []);
  React.useEffect(() => {
    if (bankAccount) {
      if (bankAccount.name) setName(bankAccount.name);
      if (bankAccount.agency) setAgency(bankAccount.agency);
      if (bankAccount.account) setAccount(bankAccount.account);
    }
  }, [bankAccount]);

  // handlers
  const onSubmitHandler = async () => {
    await updateBankAccount({
      type: 'Corrente',
      name,
      agency,
      account,
    } as BankAccount);
  };

  // UI
  if (isSuccess && redirect) return <Redirect to={redirect} push />;
  return (
    <Box maxW="464px">
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          onSubmitHandler();
        }}
      >
        <PageHeader
          title={t('Dados bancários')}
          subtitle={t('Informe para onde serão transferidos os repasses')}
        />
        <BankSelect value={name} onChange={(ev) => setName(ev.target.value)} />
        <NumberInput
          id="banking-agency"
          label={t('Agência')}
          placeholder={t('Número da agência')}
          value={agency}
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setAgency(ev.target.value)}
        />
        <Flex>
          <NumberInput
            id="banking-account"
            mr="4"
            flex={3}
            label={t('Conta')}
            placeholder={t('0000')}
            value={account}
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setAccount(ev.target.value)}
          />
        </Flex>
        <PageFooter onboarding={onboarding} redirect={redirect} isLoading={isLoading} />
      </form>
    </Box>
  );
};

export default BankingInformation;
