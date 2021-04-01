import { Box } from '@chakra-ui/react';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { CustomPatternInput } from 'common/components/form/input/pattern-input/CustomPatternInput';
import {
  cpfFormatter,
  cpfMask,
  phoneFormatter,
  phoneMask,
} from 'common/components/form/input/pattern-input/formatters';
import { numbersOnlyParser } from 'common/components/form/input/pattern-input/parsers';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../SectionTitle';

export const BusinessRegister = () => {
  // context
  const profile = {
    email: '',
    name: '',
    surname: '',
    phone: '',
    cpf: '',
  };
  // state
  const [email, setEmail] = React.useState(profile?.email ?? '');
  const [name, setName] = React.useState(profile?.name ?? '');
  const [surname, setSurname] = React.useState(profile?.surname ?? '');
  const [phoneNumber, setPhoneNumber] = React.useState(profile?.phone ?? '');
  const [cpf, setCPF] = React.useState(profile?.cpf ?? '');

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
    </Box>
  );
};
