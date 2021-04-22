import { Box } from '@chakra-ui/react';
import { useBanks } from 'app/api/business/profile/useBanks';
import { Bank, WithId } from 'appjusto-types';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { CustomPatternInput } from 'common/components/form/input/pattern-input/CustomPatternInput';
import {
  addZerosToBeginning,
  cpfFormatter,
  cpfMask,
  hyphenFormatter,
  phoneFormatter,
  phoneMask,
} from 'common/components/form/input/pattern-input/formatters';
import {
  numbersAndLettersParser,
  numbersOnlyParser,
} from 'common/components/form/input/pattern-input/parsers';
import { BankSelect } from 'common/components/form/select/BankSelect';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

const profile = {
  email: '',
  name: '',
  surname: '',
  phone: '',
  cpf: '',
};
const bankAccount = {
  name: '',
  agency: '',
  account: '',
};

export const BusinessRegister = () => {
  // context
  const banks = useBanks();
  // state manager
  const [email, setEmail] = React.useState(profile?.email ?? '');
  const [name, setName] = React.useState(profile?.name ?? '');
  const [surname, setSurname] = React.useState(profile?.surname ?? '');
  const [phoneNumber, setPhoneNumber] = React.useState(profile?.phone ?? '');
  const [cpf, setCPF] = React.useState(profile?.cpf ?? '');
  // state banking
  const [selectedBank, setSelectedBank] = React.useState<Bank>();
  const [bankName, setBankName] = React.useState(bankAccount?.name ?? '');
  const [agency, setAgency] = React.useState(bankAccount?.agency ?? '');
  const [account, setAccount] = React.useState(bankAccount?.account ?? '');

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

  // side effects
  /*React.useEffect(() => {
    if (profile) {
      setEmail(profile?.email ?? '');
      setName(profile?.name ?? '');
      setSurname(profile?.surname ?? '');
      setPhoneNumber(profile?.phone ?? '');
      setCPF(profile?.cpf ?? '');
    }
  }, [profile]);*/
  React.useEffect(() => {
    if (banks && bankName) {
      findSelectedBank(banks, bankName);
    }
  }, [banks, bankName, findSelectedBank]);

  // UI
  return (
    <Box>
      <SectionTitle>{t('Dados pessoais')}</SectionTitle>
      <form>
        <CustomInput
          isRequired
          id="bo-manager-profile-email"
          label={t('E-mail')}
          placeholder={t('E-mail')}
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
        />
        <CustomInput
          isRequired
          id="bo-manager-profile-name"
          label={t('Nome')}
          placeholder={t('Nome')}
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
        <CustomInput
          isRequired
          id="bo-manager-profile-lastname"
          label={t('Sobrenome')}
          placeholder={t('Sobrenome')}
          value={surname}
          onChange={(ev) => setSurname(ev.target.value)}
        />
        <CustomPatternInput
          isRequired
          id="bo-manager-phone"
          label={t('Celular')}
          placeholder={t('Número do seu celular')}
          mask={phoneMask}
          parser={numbersOnlyParser}
          formatter={phoneFormatter}
          value={phoneNumber}
          onValueChange={(value) => setPhoneNumber(value)}
          validationLength={11}
        />
        <CustomPatternInput
          isRequired
          id="bo-manager-cpf"
          label={t('CPF')}
          placeholder={t('Número do seu CPF')}
          mask={cpfMask}
          parser={numbersOnlyParser}
          formatter={cpfFormatter}
          value={cpf}
          onValueChange={(value) => setCPF(value)}
          validationLength={11}
        />
      </form>
      <SectionTitle>{t('Dados bancários')}</SectionTitle>
      <form>
        <BankSelect value={bankName} onChange={(ev) => setBankName(ev.target.value)} isRequired />
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
          isDisabled={bankName === ''}
        />
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
          isDisabled={bankName === ''}
        />
      </form>
    </Box>
  );
};
