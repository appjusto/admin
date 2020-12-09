import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useUpdateManagerProfile } from 'app/api/manager/useUpdateManagerProfile';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import { Input } from 'common/components/form/Input';
import { NumberInput } from 'common/components/form/NumberInput';
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
  const submitHandler = async () => {
    await updateProfile({
      name,
      surname,
      phone: {
        ddd,
        number: phoneNumber,
      },
      cpf,
    })
  }

  // UI
  if (isSuccess) return <Redirect to={redirect} push />
  return (
    <Box w="368px">
      <form onSubmit={(ev) => {
        ev.preventDefault();
        submitHandler();
      }}>
        <Text fontSize="xl" color="black">{t('Informe seus dados')}</Text>
        <Text>{t('Informações do administrador da conta')}</Text>
        <Input mt="8" label={t('E-mail')} value={user?.email ?? ''} isDisabled />
        <Input mt="4" ref={nameRef} label={t('Nome')} placeholder={t('Nome')} value={name} onChange={(ev) => setName(ev.target.value)} />
        <Input mt="4" label={t('Sobrenome')} placeholder={t('Sobrenome')} value={surname} onChange={(ev) => setSurname(ev.target.value) } />
        <Flex mt="4">
          <NumberInput flex={1} label={t('DDD')} placeholder={t('DDD')} value={ddd} onChange={(value) => setDDD(value)} />
          <NumberInput flex={4} ml="4" label={t('Celular')} placeholder={t('Número do seu celular')} value={phoneNumber} onChange={(value) => setPhoneNumber(value)} />
        </Flex>
        <Input mt="4" label={t('CPF')} placeholder={t('Número do seu CPF')} value={cpf} onChange={(ev) => setCPF(ev.target.value)} />
        <Button mt="4" size="lg" onClick={submitHandler} isLoading={isLoading}>{t('Avançar')}</Button>
      </form>
    </Box>
  );
}
