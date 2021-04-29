import { Box, Flex, HStack, Radio, RadioGroup, Text } from '@chakra-ui/react';
import { useBanks } from 'app/api/business/profile/useBanks';
import { useBusinessBankAccount } from 'app/api/business/profile/useBusinessBankAccount';
import { Bank, BankAccount, WithId } from 'appjusto-types';
import { BankAccountPersonType, BankAccountType } from 'appjusto-types/banking';
import { AlertError } from 'common/components/AlertError';
import { AlertSuccess } from 'common/components/AlertSuccess';
import { AlertWarning } from 'common/components/AlertWarning';
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
  const [personType, setPersonType] = React.useState(bankAccount?.personType ?? '');
  const [type, setType] = React.useState(bankAccount?.type ?? '');
  const [name, setName] = React.useState(bankAccount?.name ?? '');
  const [agency, setAgency] = React.useState(bankAccount?.agency ?? '');
  const [account, setAccount] = React.useState(bankAccount?.account ?? '');
  const [validation, setValidation] = React.useState({ agency: true, account: true });

  // refs
  const nameRef = React.useRef<HTMLSelectElement>(null);
  const agencyRef = React.useRef<HTMLInputElement>(null);
  const accountRef = React.useRef<HTMLInputElement>(null);

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

  const bankWarning = selectedBank?.warning ? selectedBank?.warning.split(/\n/g) : [];

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
    if (!validation.agency) return agencyRef?.current?.focus();
    if (!validation.account) return accountRef?.current?.focus();
    const agencyFormatted = agencyFormatter!(agency);
    const accountFormatted = accountFormatter!(account);
    await updateBankAccount({
      personType,
      type,
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
      setPersonType(bankAccount.personType);
      setType(bankAccount.type);
      setName(bankAccount.name);
      setName(bankAccount.name);
      setAgency(bankAccount.agency);
      setAccount(bankAccount.account);
    } else {
      setPersonType('');
      setType('');
      setName('');
      setName('');
      setAgency('');
      setAccount('');
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
        {!backoffice && <PageHeader title={t('Dados bancários')} />}
        <Text mt="4">
          <Text as="span" color="red">
            {t('Aviso:')}
          </Text>
          {t(
            ' a conta precisa estar no seu nome ou da sua MEI ou empresa. Se seu CNPJ for de MEI, você pode cadastrar sua conta Pessoa Física. Caso contrário, você precisará cadastrar uma conta corrente no nome da sua Pessoa Jurídica.'
          )}
        </Text>
        <Text mt="4" mb="2" color="black" fontWeight="700">
          {t('Personalidade da conta:')}
        </Text>
        <RadioGroup
          onChange={(value) => setPersonType(value as BankAccountPersonType)}
          value={personType}
          defaultValue="1"
          colorScheme="green"
          color="black"
          fontSize="15px"
          lineHeight="21px"
        >
          <HStack
            alignItems="flex-start"
            color="black"
            spacing={8}
            fontSize="16px"
            lineHeight="22px"
          >
            <Radio value="Pessoa Física">{t('Pessoa Física')}</Radio>
            <Radio value="Pessoa Jurídica">{t('Pessoa Jurídica')}</Radio>
          </HStack>
        </RadioGroup>
        <Text mt="4" mb="2" color="black" fontWeight="700">
          {t('Tipo de conta:')}
        </Text>
        <RadioGroup
          onChange={(value) => setType(value as BankAccountType)}
          value={type}
          defaultValue="1"
          colorScheme="green"
          color="black"
          fontSize="15px"
          lineHeight="21px"
        >
          <HStack
            alignItems="flex-start"
            color="black"
            spacing={8}
            fontSize="16px"
            lineHeight="22px"
          >
            <Radio value="Corrente">{t('Corrente')}</Radio>
            <Radio value="Poupança">{t('Poupança')}</Radio>
          </HStack>
        </RadioGroup>
        <BankSelect
          ref={nameRef}
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          isRequired
        />
        {selectedBank?.warning && (
          <AlertWarning icon={false}>
            {bankWarning.length > 1 &&
              bankWarning.map((item) => {
                return <Text>{item}</Text>;
              })}
          </AlertWarning>
        )}
        <CustomPatternInput
          id="banking-agency"
          ref={agencyRef}
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
          isDisabled={name === ''}
          notifyParentWithValidation={(isInvalid: boolean) => {
            setValidation((prevState) => ({ ...prevState, agency: !isInvalid }));
          }}
        />
        <Flex>
          <CustomPatternInput
            id="banking-account"
            ref={accountRef}
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
            notifyParentWithValidation={(isInvalid: boolean) => {
              setValidation((prevState) => ({ ...prevState, account: !isInvalid }));
            }}
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
