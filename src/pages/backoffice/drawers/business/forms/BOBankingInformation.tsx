import { Box, Flex, HStack, Radio, RadioGroup, Text } from '@chakra-ui/react';
import { useBanks } from 'app/api/business/profile/useBanks';
import { useContextBusinessBackoffice } from 'app/state/business/businessBOContext';
import { Bank, WithId } from 'appjusto-types';
import { BankAccountPersonType, BankAccountType } from 'appjusto-types/banking';
import { AlertWarning } from 'common/components/AlertWarning';
import { CustomPatternInput } from 'common/components/form/input/pattern-input/CustomPatternInput';
import {
  addZerosToBeginning,
  hyphenFormatter,
} from 'common/components/form/input/pattern-input/formatters';
import { numbersAndLettersParser } from 'common/components/form/input/pattern-input/parsers';
import { BankSelect } from 'common/components/form/select/BankSelect';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { t } from 'utils/i18n';

const BOBankingInformation = () => {
  // context
  const banks = useBanks();
  const {
    bankAccount,
    handleBankingInfoChange,
    setContextValidation,
  } = useContextBusinessBackoffice();
  // state
  const [selectedBank, setSelectedBank] = React.useState<Bank>();
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
    if (selectedBank?.accountPattern && bankAccount?.account) {
      const patterLen = selectedBank?.accountPattern.length - 1;
      const result = addZerosToBeginning(bankAccount.account, patterLen);
      handleBankingInfoChange('account', result);
      const accountFormatted = accountFormatter!(result);
      handleBankingInfoChange('accountFormatted', accountFormatted);
    }
  };

  // side effects
  React.useEffect(() => {
    if (banks && bankAccount?.name) {
      findSelectedBank(banks, bankAccount.name);
    }
  }, [banks, bankAccount?.name, findSelectedBank]);

  React.useEffect(() => {
    setContextValidation((prev) => ({ ...prev, ...validation }));
  }, [validation, setContextValidation]);

  // UI
  return (
    <Box maxW="464px">
      <PageHeader title={t('Dados bancários')} />
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
        onChange={(value) => handleBankingInfoChange('personType', value as BankAccountPersonType)}
        value={bankAccount?.personType ?? 'Pessoa Jurídica'}
        defaultValue="1"
        colorScheme="green"
        color="black"
        fontSize="15px"
        lineHeight="21px"
      >
        <HStack alignItems="flex-start" color="black" spacing={8} fontSize="16px" lineHeight="22px">
          <Radio value="Pessoa Jurídica">{t('Pessoa Jurídica')}</Radio>
          <Radio value="Pessoa Física">{t('Pessoa Física')}</Radio>
        </HStack>
      </RadioGroup>
      <Text mt="4" mb="2" color="black" fontWeight="700">
        {t('Tipo de conta:')}
      </Text>
      <RadioGroup
        onChange={(value) => handleBankingInfoChange('type', value as BankAccountType)}
        value={bankAccount?.type ?? 'Corrente'}
        defaultValue="1"
        colorScheme="green"
        color="black"
        fontSize="15px"
        lineHeight="21px"
      >
        <HStack alignItems="flex-start" color="black" spacing={8} fontSize="16px" lineHeight="22px">
          <Radio value="Corrente">{t('Corrente')}</Radio>
          <Radio value="Poupança">{t('Poupança')}</Radio>
        </HStack>
      </RadioGroup>
      <BankSelect
        ref={nameRef}
        value={bankAccount?.name ?? ''}
        onChange={(ev) => handleBankingInfoChange('name', ev.target.value)}
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
        value={bankAccount?.agency ?? ''}
        onValueChange={(value) => {
          handleBankingInfoChange('agency', value);
          const agencyFormatted = agencyFormatter!(value);
          handleBankingInfoChange('agencyFormatted', agencyFormatted);
        }}
        mask={selectedBank?.agencyPattern}
        parser={agencyParser}
        formatter={agencyFormatter}
        validationLength={
          selectedBank?.agencyPattern ? selectedBank.agencyPattern.length - 1 : undefined
        }
        isRequired
        isDisabled={!bankAccount?.name}
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
          value={bankAccount?.account ?? ''}
          onValueChange={(value) => handleBankingInfoChange('account', value)}
          mask={selectedBank?.accountPattern}
          parser={accountParser}
          formatter={accountFormatter}
          onBlur={handleAccount}
          isRequired
          isDisabled={!bankAccount?.name}
          notifyParentWithValidation={(isInvalid: boolean) => {
            setValidation((prevState) => ({ ...prevState, account: !isInvalid }));
          }}
        />
      </Flex>
    </Box>
  );
};

export default BOBankingInformation;
