import { Box, Flex, HStack, RadioGroup, Text } from '@chakra-ui/react';
import { useBanks } from 'app/api/business/profile/useBanks';
import { useContextCourierProfile } from 'app/state/courier/context';
import { Bank, WithId } from 'appjusto-types';
import { AlertWarning } from 'common/components/AlertWarning';
import CustomRadio from 'common/components/form/CustomRadio';
import { CustomPatternInput } from 'common/components/form/input/pattern-input/CustomPatternInput';
import {
  addZerosToBeginning,
  hyphenFormatter,
} from 'common/components/form/input/pattern-input/formatters';
import { numbersAndLettersParser } from 'common/components/form/input/pattern-input/parsers';
import { BankSelect } from 'common/components/form/select/BankSelect';
import React from 'react';
import { t } from 'utils/i18n';

export const ProfileBankingInfo = () => {
  // context
  const banks = useBanks();
  const { courier, handleProfileChange, setContextValidation } = useContextCourierProfile();

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
  const handleInputChange = (field: string, value: string) => {
    const newBankAccount = {
      ...courier?.bankAccount,
      [field]: value,
    };
    if (field === 'agency') newBankAccount.agencyFormatted = agencyFormatter!(value);
    if (field === 'account') newBankAccount.accountFormatted = accountFormatter!(value);
    handleProfileChange('bankAccount', newBankAccount);
  };

  const findSelectedBank = React.useCallback((banks: WithId<Bank>[], bankName: string) => {
    const bank = banks?.find((b) => b.name === bankName);
    setSelectedBank(bank);
  }, []);

  const handleAccount = () => {
    if (selectedBank?.accountPattern) {
      const patterLen = selectedBank?.accountPattern.length - 1;
      const result = addZerosToBeginning(courier?.bankAccount?.account!, patterLen);
      handleInputChange('account', result);
    }
  };

  // side effects
  React.useEffect(() => {
    if (banks && courier?.bankAccount?.name) {
      findSelectedBank(banks, courier?.bankAccount?.name);
    }
  }, [banks, courier?.bankAccount?.name, findSelectedBank]);

  React.useEffect(() => {
    setContextValidation((prevState) => {
      return {
        ...prevState,
        agency: validation.agency,
        account: validation.account,
      };
    });
  }, [validation, setContextValidation]);

  // UI
  return (
    <Box>
      <Text mt="4">
        <Text as="span" color="red">
          {t('Aviso:')}
        </Text>
        {t(
          ' a conta precisa estar no nome do entregador ou da sua MEI ou empresa. Se o CNPJ for de MEI, precisará ser conta Pessoa Física. Caso contrário, deverá ser conta corrente no nome da Pessoa Jurídica.'
        )}
      </Text>
      <Text mt="4" mb="2" color="black" fontWeight="700">
        {t('Personalidade da conta:')}
      </Text>
      <RadioGroup
        onChange={(value) => handleInputChange('personType', value as string)}
        value={courier?.bankAccount?.personType ?? 'Pessoa Física'}
        colorScheme="green"
        color="black"
        fontSize="15px"
        lineHeight="21px"
      >
        <HStack alignItems="flex-start" color="black" spacing={8} fontSize="16px" lineHeight="22px">
          <CustomRadio value="Pessoa Física">{t('Pessoa Física')}</CustomRadio>
          <CustomRadio value="Pessoa Jurídica">{t('Pessoa Jurídica')}</CustomRadio>
        </HStack>
      </RadioGroup>
      <Text mt="4" mb="2" color="black" fontWeight="700">
        {t('Tipo de conta:')}
      </Text>
      <RadioGroup
        onChange={(value) => handleInputChange('type', value as string)}
        value={courier?.bankAccount?.type ?? 'Corrente'}
        colorScheme="green"
        color="black"
        fontSize="15px"
        lineHeight="21px"
      >
        <HStack alignItems="flex-start" color="black" spacing={8} fontSize="16px" lineHeight="22px">
          <CustomRadio value="Corrente">{t('Corrente')}</CustomRadio>
          <CustomRadio value="Poupança">{t('Poupança')}</CustomRadio>
        </HStack>
      </RadioGroup>
      <BankSelect
        ref={nameRef}
        value={courier?.bankAccount?.name ?? ''}
        onChange={(ev) => handleInputChange('name', ev.target.value)}
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
        label={t('Agência')}
        placeholder={
          (selectedBank?.agencyPattern.indexOf('D') ?? -1) > -1
            ? t('Número da agência com o dígito')
            : t('Número da agência')
        }
        value={courier?.bankAccount?.agency ?? ''}
        onValueChange={(value) => handleInputChange('agency', value)}
        mask={selectedBank?.agencyPattern}
        parser={agencyParser}
        formatter={agencyFormatter}
        validationLength={
          selectedBank?.agencyPattern ? selectedBank.agencyPattern.length - 1 : undefined
        }
        isRequired
        isDisabled={courier?.bankAccount?.name === ''}
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
          value={courier?.bankAccount?.account ?? ''}
          onValueChange={(value) => handleInputChange('account', value)}
          mask={selectedBank?.accountPattern}
          parser={accountParser}
          formatter={accountFormatter}
          onBlur={handleAccount}
          isRequired
          isDisabled={courier?.bankAccount?.name === ''}
          notifyParentWithValidation={(isInvalid: boolean) => {
            setValidation((prevState) => ({ ...prevState, account: !isInvalid }));
          }}
        />
      </Flex>
    </Box>
  );
};
