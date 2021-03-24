import { Box, Flex } from '@chakra-ui/react';
import { useBanks } from 'app/api/business/profile/useBanks';
import { useBusinessBankAccount } from 'app/api/business/profile/useBusinessBankAccount';
import { Bank, BankAccount } from 'appjusto-types';
import { CustomPatternInput } from 'common/components/form/input/pattern-input/CustomPatternInput';
import { hyphenFormatter } from 'common/components/form/input/pattern-input/formatters';
import { numbersAndLettersParser } from 'common/components/form/input/pattern-input/parsers';
import { BankSelect } from 'common/components/form/select/BankSelect';
import { isEmpty } from 'lodash';
import { OnboardingProps } from 'pages/onboarding/types';
import PageFooter from 'pages/PageFooter';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';

const bankAccountSet = (bankAccount: BankAccount): boolean => {
  return (
    !isEmpty(bankAccount.name) && !isEmpty(bankAccount.agency) && !isEmpty(bankAccount.account)
  );
};

const BankingInformation = ({ onboarding, redirect }: OnboardingProps) => {
  // context
  const banks = useBanks();
  const { bankAccount, updateBankAccount, updateResult } = useBusinessBankAccount();
  const { isLoading, isSuccess } = updateResult;
  // state
  const [selectedBank, setSelectedBank] = React.useState<Bank>();
  const [name, setName] = React.useState(bankAccount?.name ?? '');
  const [agency, setAgency] = React.useState(bankAccount?.agency ?? '');
  const [account, setAccount] = React.useState(bankAccount?.account ?? '');

  // refs
  const nameRef = React.useRef<HTMLSelectElement>(null);

  // helpers
  const agencyParser = selectedBank?.agencyPattern
    ? numbersAndLettersParser(selectedBank?.agencyPattern)
    : undefined;
  const agencyFormatter = selectedBank?.agencyPattern
    ? hyphenFormatter(selectedBank?.agencyPattern.indexOf('-'))
    : undefined;
  const accountParser = selectedBank?.accountPattern
    ? numbersAndLettersParser(selectedBank?.accountPattern)
    : undefined;
  const accountFormatter = selectedBank?.accountPattern
    ? hyphenFormatter(selectedBank?.accountPattern.indexOf('-'))
    : undefined;

  // handlers
  const onSubmitHandler = async () => {
    const agencyFormatted = agencyFormatter!(agency);
    const accountFormatted = accountFormatter!(account);
    console.log(accountFormatted);
    await updateBankAccount({
      type: 'Corrente',
      name,
      agency,
      agencyFormatted,
      account,
      accountFormatted,
    } as BankAccount);
  };

  // side effects
  React.useEffect(() => {
    nameRef?.current?.focus();
  }, []);
  React.useEffect(() => {
    if (bankAccount && bankAccountSet(bankAccount)) {
      setName(bankAccount.name);
      setAgency(bankAccount.agency);
      setAccount(bankAccount.account);
    }
  }, [bankAccount]);

  React.useEffect(() => {
    if (name) {
      const bank = banks?.find((b) => b.name === name);
      setSelectedBank(bank);
    }
  }, [name]);

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
        <BankSelect
          ref={nameRef}
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          isRequired
        />
        <CustomPatternInput
          id="banking-agency"
          label={t('Agência')}
          placeholder={
            (selectedBank?.agencyPattern.indexOf('D') ?? -1) > -1
              ? t('Número da agência com o dígito')
              : t('Número da agência')
          }
          value={agency}
          onValueChange={(value) => setAgency(value)}
          mask={selectedBank?.agencyPattern}
          parser={agencyParser}
          formatter={agencyFormatter}
          validationLength={
            selectedBank?.agencyPattern ? selectedBank.agencyPattern.length - 1 : undefined
          }
          isRequired
        />
        <Flex>
          <CustomPatternInput
            id="banking-account"
            flex={3}
            label={t('Conta')}
            placeholder={
              (selectedBank?.accountPattern.indexOf('D') ?? -1) > -1
                ? t('Número da conta com o dígito')
                : t('Número da conta')
            }
            value={account}
            onValueChange={(value) => setAccount(value)}
            mask={selectedBank?.accountPattern}
            parser={accountParser}
            formatter={accountFormatter}
            isRequired
          />
        </Flex>
        <PageFooter onboarding={onboarding} redirect={redirect} isLoading={isLoading} />
      </form>
    </Box>
  );
};

export default BankingInformation;
