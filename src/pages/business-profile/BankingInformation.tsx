import { Box, Flex } from '@chakra-ui/react';
import { useBusinessBankAccount } from 'app/api/business/profile/useBusinessBankAccount';
import { CustomNumberInput as NumberInput } from 'common/components/form/input/CustomNumberInput';
import { BankSelect } from 'common/components/form/select/BankSelect';
import { OnboardingProps } from 'pages/onboarding/types';
import PageFooter from 'pages/PageFooter';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';

export const BankingInformation = ({ onboarding, redirect }: OnboardingProps) => {
  // context
  const { bankAccount, updateBankAccount, updateResult } = useBusinessBankAccount();
  const { isLoading, isSuccess } = updateResult;

  // state
  const [name, setName] = React.useState(bankAccount?.name ?? '');
  const [agency, setAgency] = React.useState(bankAccount?.agency ?? '');
  const [account, setAccount] = React.useState(bankAccount?.account ?? '');
  const [digit, setDigit] = React.useState(bankAccount?.digit ?? '');

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
      if (bankAccount.digit) setDigit(bankAccount.digit);
    }
  }, [bankAccount]);

  // handlers
  const onSubmitHandler = async () => {
    await updateBankAccount({
      name,
      agency,
      account,
      digit,
    });
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
          <NumberInput
            id="banking-digit"
            flex={1}
            label={t('Dígito')}
            placeholder={t('0')}
            value={digit}
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setDigit(ev.target.value)}
            maxLength={1}
          />
        </Flex>
        <PageFooter
          onboarding={onboarding}
          redirect={redirect}
          isLoading={isLoading}
          onSubmit={onSubmitHandler}
        />
      </form>
    </Box>
  );
};
