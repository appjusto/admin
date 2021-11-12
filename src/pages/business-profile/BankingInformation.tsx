import { Box, Flex, RadioGroup, Stack, Text } from '@chakra-ui/react';
import { useBanks } from 'app/api/business/profile/useBanks';
import { useBusinessBankAccount } from 'app/api/business/profile/useBusinessBankAccount';
import { useContextBusiness } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { Bank, BankAccount, WithId } from 'appjusto-types';
import { BankAccountPersonType, BankAccountType } from 'appjusto-types/banking';
import { AlertWarning } from 'common/components/AlertWarning';
import CustomRadio from 'common/components/form/CustomRadio';
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
import { getCEFAccountCode } from 'utils/functions';
import { t } from 'utils/i18n';

const bankAccountSet = (bankAccount: BankAccount): boolean => {
  return (
    !isEmpty(bankAccount.name) && !isEmpty(bankAccount.agency) && !isEmpty(bankAccount.account)
  );
};

const BankingInformation = ({ onboarding, redirect }: OnboardingProps) => {
  // context
  const banks = useBanks();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { business } = useContextBusiness();
  const { bankAccount, updateBankAccount, updateResult } = useBusinessBankAccount(
    typeof onboarding === 'string'
  );
  const { isLoading, isSuccess } = updateResult;
  // state
  const [selectedBank, setSelectedBank] = React.useState<Bank>();
  const [personType, setPersonType] = React.useState(bankAccount?.personType ?? 'Pessoa Jurídica');
  const [type, setType] = React.useState(bankAccount?.type ?? 'Corrente');
  const [name, setName] = React.useState(bankAccount?.name ?? '');
  const [agency, setAgency] = React.useState(bankAccount?.agency ?? '');
  const [account, setAccount] = React.useState(bankAccount?.account ?? '');
  const [validation, setValidation] = React.useState({ agency: true, account: true });
  // refs
  const nameRef = React.useRef<HTMLSelectElement>(null);
  const agencyRef = React.useRef<HTMLInputElement>(null);
  const accountRef = React.useRef<HTMLInputElement>(null);
  // helpers
  const disabled = business?.situation === 'approved';

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
    let code = '';
    if (!validation.agency) {
      dispatchAppRequestResult({
        status: 'error',
        requestId: 'BankingInformation-valid-agency',
        message: { title: 'A agência informada não é válida.' },
      });
      return agencyRef?.current?.focus();
    }
    if (!validation.account) {
      dispatchAppRequestResult({
        status: 'error',
        requestId: 'BankingInformation-valid-account',
        message: { title: 'A conta informada não é válida.' },
      });
      return accountRef?.current?.focus();
    }
    if (selectedBank?.code === '341' && agency === '0500') {
      dispatchAppRequestResult({
        status: 'error',
        requestId: 'BankingInformation-valid-bank',
        message: { title: 'A iugu ainda não aceita contas Itaú - iti. Escolha outra, por favor.' },
      });
      return agencyRef?.current?.focus();
    }
    if (selectedBank?.code === '104') {
      code = getCEFAccountCode(selectedBank.code, personType, type);
    }
    const agencyFormatted = agencyFormatter!(agency);
    const accountFormatted = code + accountFormatter!(account);
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
      setPersonType('Pessoa Jurídica');
      setType('Corrente');
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
        <PageHeader title={t('Dados bancários')} />
        <Text mt="4">
          <Text as="span" color="red">
            {t('Aviso:')}
          </Text>
          {t(
            ' a conta precisa estar no seu nome ou da sua MEI ou empresa. Se seu CNPJ for de MEI, você pode cadastrar sua conta Pessoa Física. Caso contrário, você precisará cadastrar uma conta corrente no nome da sua Pessoa Jurídica.'
          )}
        </Text>
        <Text mt="6" mb="2" color="black" fontWeight="700">
          {t('Personalidade da conta:')}
        </Text>
        <RadioGroup
          onChange={(value) => {
            setPersonType(value as BankAccountPersonType);
            setType('Corrente');
          }}
          value={personType}
          defaultValue="1"
          colorScheme="green"
          color="black"
          fontSize="15px"
          lineHeight="21px"
        >
          <Stack
            direction="row"
            alignItems="flex-start"
            color="black"
            spacing={8}
            fontSize="16px"
            lineHeight="22px"
          >
            <CustomRadio isDisabled={disabled} value="Pessoa Jurídica">
              {t('Pessoa Jurídica')}
            </CustomRadio>
            <CustomRadio isDisabled={disabled} value="Pessoa Física">
              {t('Pessoa Física')}
            </CustomRadio>
          </Stack>
        </RadioGroup>
        {business?.situation !== 'approved' && personType === 'Pessoa Física' && (
          <AlertWarning
            title={t('Tem certeza que a sua conta bancária é de Pessoa Física?')}
            description={t(
              'Essa informação é muito importante para que as transferências sejam feitas corretamente. Só escolha Pessoa Física caso tenha certeza que sua conta bancária está configurada dessa forma.'
            )}
            icon={false}
          />
        )}
        <BankSelect
          mt="6"
          ref={nameRef}
          isDisabled={disabled}
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          isRequired
        />
        {selectedBank?.warning && (
          <AlertWarning icon={false}>
            {bankWarning.length > 1 &&
              bankWarning.map((item) => {
                return <Text key={item}>{item}</Text>;
              })}
          </AlertWarning>
        )}
        <CustomPatternInput
          id="banking-agency"
          ref={agencyRef}
          isDisabled={disabled || name === ''}
          label={t('Agência *')}
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
          notifyParentWithValidation={(isInvalid: boolean) => {
            setValidation((prevState) => ({ ...prevState, agency: !isInvalid }));
          }}
        />
        <Flex>
          <CustomPatternInput
            id="banking-account"
            ref={accountRef}
            isDisabled={disabled || name === ''}
            flex={3}
            label={t('Conta *')}
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
            notifyParentWithValidation={(isInvalid: boolean) => {
              setValidation((prevState) => ({ ...prevState, account: !isInvalid }));
            }}
          />
        </Flex>
        <Text mt="6" mb="2" color="black" fontWeight="700">
          {t('Tipo de conta:')}
        </Text>
        <RadioGroup
          onChange={(value) => setType(value as BankAccountType)}
          value={type}
          colorScheme="green"
          color="black"
          fontSize="15px"
          lineHeight="21px"
        >
          {selectedBank?.code === '104' ? (
            personType === 'Pessoa Jurídica' ? (
              <Stack
                direction="row"
                alignItems="flex-start"
                color="black"
                spacing={8}
                fontSize="16px"
                lineHeight="22px"
              >
                <CustomRadio value="Corrente">{t('003 – Conta Corrente')}</CustomRadio>
                <CustomRadio value="Poupança">{t('022 – Conta Poupança')}</CustomRadio>
              </Stack>
            ) : (
              <Stack
                mt="2"
                direction="column"
                alignItems="flex-start"
                color="black"
                spacing={4}
                fontSize="16px"
                lineHeight="22px"
              >
                <CustomRadio value="Corrente">{t('001 – Conta Corrente')}</CustomRadio>
                <CustomRadio value="Simples">{t('002 – Conta Simples')}</CustomRadio>
                <CustomRadio value="Poupança">{t('013 – Conta Poupança')}</CustomRadio>
                <CustomRadio value="Nova Poupança">
                  {t('1288 – Conta Poupança (novo formato)')}
                </CustomRadio>
              </Stack>
            )
          ) : (
            <Stack
              direction="row"
              alignItems="flex-start"
              color="black"
              spacing={8}
              fontSize="16px"
              lineHeight="22px"
            >
              <CustomRadio value="Corrente">{t('Corrente')}</CustomRadio>
              <CustomRadio value="Poupança">{t('Poupança')}</CustomRadio>
            </Stack>
          )}
        </RadioGroup>
        <PageFooter
          onboarding={onboarding}
          redirect={redirect}
          isLoading={isLoading}
          isDisabled={disabled}
        />
      </form>
    </Box>
  );
};

export default BankingInformation;
