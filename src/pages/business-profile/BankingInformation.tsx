import { Box, Flex } from '@chakra-ui/react';
import { useBanks } from 'app/api/business/profile/useBanks';
import { useBusinessBankAccount } from 'app/api/business/profile/useBusinessBankAccount';
import { Bank, BankAccount, WithId } from 'appjusto-types';
import { AlertError } from 'common/components/AlertError';
import { AlertSuccess } from 'common/components/AlertSuccess';
import { CustomPatternInput } from 'common/components/form/input/pattern-input/CustomPatternInput';
import {
  addZerosToBeginning,
  hyphenFormatter,
} from 'common/components/form/input/pattern-input/formatters';
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

const BankingInformation = ({ onboarding, redirect, backoffice }: OnboardingProps) => {
  // context
  const banks = useBanks();
  const { bankAccount, updateBankAccount, updateResult } = useBusinessBankAccount();
  const { isLoading, isSuccess, isError } = updateResult;
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
  const findSelectedBank = React.useCallback((banks: WithId<Bank>[], bankName: string) => {
    const bank = banks?.find((b) => b.name === bankName);
    setSelectedBank(bank);
  }, []);

  const handleAccount = () => {
    if (selectedBank?.accountPattern) {
      const patterLen = selectedBank?.accountPattern.length - 1;
      const result = addZerosToBeginning(account, patterLen);
      setAccount(result);
    }
  };

  const onSubmitHandler = async () => {
    const agencyFormatted = agencyFormatter!(agency);
    const accountFormatted = accountFormatter!(account);
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
    if (onboarding) {
      window?.scrollTo(0, 0);
      nameRef?.current?.focus();
    }
  }, [onboarding]);
  React.useEffect(() => {
    if (bankAccount && bankAccountSet(bankAccount)) {
      setName(bankAccount.name);
      setAgency(bankAccount.agency);
      setAccount(bankAccount.account);
    }
  }, [bankAccount]);

  React.useEffect(() => {
    if (banks && name) {
      findSelectedBank(banks, name);
    }
  }, [banks, name, findSelectedBank]);

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
        {!backoffice && (
          <PageHeader
            title={t('Dados bancários')}
            subtitle={t('Informe para onde serão transferidos os repasses')}
          />
        )}
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
            (selectedBank?.agencyPattern.indexOf('D') ?? -1) > -1 // think about X
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
          isDisabled={name === ''}
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
            onBlur={handleAccount}
            isRequired
            isDisabled={name === ''}
          />
        </Flex>
        <PageFooter onboarding={onboarding} redirect={redirect} isLoading={isLoading} />
        {!onboarding && isSuccess && (
          <AlertSuccess
            maxW="320px"
            title={t('Informações salvas com sucesso!')}
            description={''}
          />
        )}
        {isError && (
          <AlertError
            w="100%"
            title={t('Erro')}
            description={'Não foi possível acessar o servidor. Tenta novamente?'}
          />
        )}
      </form>
    </Box>
  );
};

export default BankingInformation;
