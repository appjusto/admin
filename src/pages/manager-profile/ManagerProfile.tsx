import { Button, Flex } from '@chakra-ui/react';
import { useUpdateManagerProfile } from 'app/api/manager/useUpdateManagerProfile';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import { Input } from 'common/components/form/input/Input';
import {
  cpfFormatter,
  cpfMask,
  phoneFormatter,
  phoneMask,
} from 'common/components/form/input/pattern-input/formatters';
import { numbersOnlyParser } from 'common/components/form/input/pattern-input/parsers';
import { PatternInput } from 'common/components/form/input/pattern-input/PatternInput';
import PageHeader from 'pages/PageHeader';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';

interface Props {
  redirect: string;
}

export const ManagerProfile = ({ redirect }: Props) => {
  // context
  const user = useContextFirebaseUser();
  const profile = useContextManagerProfile();
  const { updateProfile, updateResult } = useUpdateManagerProfile();
  const { isLoading, isSuccess } = updateResult;

  // state
  const [name, setName] = React.useState(profile?.name ?? '');
  const [surname, setSurname] = React.useState(profile?.surname ?? '');
  const [ddd, setDDD] = React.useState(profile?.phone?.ddd ?? '');
  const [phoneNumber, setPhoneNumber] = React.useState(profile?.phone?.number ?? '');
  const [cpf, setCPF] = React.useState(profile?.cpf ?? '');

  // refs
  const nameRef = React.useRef<HTMLInputElement>(null);

  // side effects
  React.useEffect(() => {
    nameRef?.current?.focus();
  }, []);
  React.useEffect(() => {
    if (profile) {
      if (profile.name) setName(profile.name);
      if (profile.surname) setSurname(profile.surname);
      if (profile.phone?.ddd) setDDD(profile.phone.ddd);
      if (profile.phone?.number) setPhoneNumber(profile.phone.number);
      if (profile.cpf) setCPF(profile.cpf);
    }
  }, [profile]);

  // handlers
  const onSubmitHandler = async () => {
    await updateProfile({
      name,
      surname,
      phone: {
        ddd,
        number: phoneNumber,
      },
      cpf,
    });
  };

  // UI
  if (isSuccess) return <Redirect to={redirect} push />;
  return (
    <>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          onSubmitHandler();
        }}
      >
        <PageHeader
          title={t('Informe seus dados')}
          subtitle={t('Informações do administrador da conta')}
        />
        <Input mt="8" label={t('E-mail')} value={user?.email ?? ''} isDisabled />
        <Input
          mt="4"
          ref={nameRef}
          label={t('Nome')}
          placeholder={t('Nome')}
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
        <Input
          mt="4"
          label={t('Sobrenome')}
          placeholder={t('Sobrenome')}
          value={surname}
          onChange={(ev) => setSurname(ev.target.value)}
        />
        <Flex mt="4">
          <PatternInput
            flex={1}
            label={t('DDD')}
            placeholder={t('00')}
            maxLength={2}
            parser={numbersOnlyParser}
            value={ddd}
            onValueChange={(value) => setDDD(value)}
          />
          <PatternInput
            flex={4}
            ml="4"
            label={t('Celular')}
            placeholder={t('Número do seu celular')}
            mask={phoneMask}
            parser={numbersOnlyParser}
            formatter={phoneFormatter}
            value={phoneNumber}
            onValueChange={(value) => setPhoneNumber(value)}
          />
        </Flex>
        <PatternInput
          mt="4"
          label={t('CPF')}
          placeholder={t('Número do seu CPF')}
          mask={cpfMask}
          parser={numbersOnlyParser}
          formatter={cpfFormatter}
          value={cpf}
          onValueChange={(value) => setCPF(value)}
        />
        <Button mt="4" size="lg" onClick={onSubmitHandler} isLoading={isLoading}>
          {t('Avançar')}
        </Button>
      </form>
    </>
  );
};
