import { ManagerProfile, WithId } from '@appjusto/types';
import { Box, Button, Flex } from '@chakra-ui/react';
import * as cpfutils from '@fnando/cpf';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { CustomPatternInput } from 'common/components/form/input/pattern-input/CustomPatternInput';
import {
  cpfFormatter,
  cpfMask,
  phoneFormatter,
  phoneMask,
} from 'common/components/form/input/pattern-input/formatters';
import { numbersOnlyParser } from 'common/components/form/input/pattern-input/parsers';
import React, { FormEvent } from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

interface ManagerFormProps {
  manager?: WithId<ManagerProfile> | null;
  updateManager(changes: Partial<ManagerProfile>): void;
  isLoading: boolean;
}

export const ManagerForm = ({ manager, updateManager, isLoading }: ManagerFormProps) => {
  // context
  const { userAbility } = useContextFirebaseUser();
  const { dispatchAppRequestResult } = useContextAppRequests();
  // state
  // const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [surname, setSurname] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [cpf, setCpf] = React.useState('');
  // refs
  const nameRef = React.useRef<HTMLInputElement>(null);
  const cpfRef = React.useRef<HTMLInputElement>(null);
  const phoneNumberRef = React.useRef<HTMLInputElement>(null);
  // helpers
  const userCanUpdateManager = userAbility?.can('update', 'managers');
  const isCPFValid = () => cpfutils.isValid(cpf);
  // handlers
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isCPFValid()) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'manager-form-invalid-cpf',
        message: { title: 'O CPF informado não é válido' },
      });
    }
    const changes = {
      name,
      surname,
      phone,
      cpf,
    };
    updateManager(changes);
  };
  // side effects
  React.useEffect(() => {
    if (manager?.name) setName(manager.name);
    if (manager?.surname) setSurname(manager.surname);
    if (manager?.phone) setPhone(manager.phone);
    if (manager?.cpf) setCpf(manager.cpf);
  }, [manager]);
  // UI
  return (
    <Flex
      flex={1}
      flexDir="column"
      maxW="464px"
      h="100%"
      justifyContent="space-between"
      as="form"
      onSubmit={handleSubmit}
    >
      <Box>
        <SectionTitle>{t('Dados cadastrados:')}</SectionTitle>
        <CustomInput
          id="manager-profile-email"
          label={t('E-mail')}
          value={manager?.email ?? ''}
          isDisabled
        />
        <CustomInput
          isRequired
          id="manager-profile-name"
          ref={nameRef}
          label={t('Nome')}
          placeholder={t('Nome')}
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          isDisabled={!userCanUpdateManager}
        />
        <CustomInput
          isRequired
          id="manager-profile-lastname"
          label={t('Sobrenome')}
          placeholder={t('Sobrenome')}
          value={surname}
          onChange={(ev) => setSurname(ev.target.value)}
          isDisabled={!userCanUpdateManager}
        />
        <CustomPatternInput
          isRequired
          ref={phoneNumberRef}
          id="manager-phone"
          label={t('Celular')}
          placeholder={t('Número do seu celular')}
          mask={phoneMask}
          parser={numbersOnlyParser}
          formatter={phoneFormatter}
          value={phone}
          onValueChange={(value) => setPhone(value)}
          validationLength={11}
          isDisabled={!userCanUpdateManager}
        />
        <CustomPatternInput
          isRequired
          ref={cpfRef}
          id="manager-cpf"
          label={t('CPF')}
          placeholder={t('Número do seu CPF')}
          mask={cpfMask}
          parser={numbersOnlyParser}
          formatter={cpfFormatter}
          value={cpf}
          onValueChange={(value) => setCpf(value)}
          externalValidation={{ active: true, status: isCPFValid() }}
          isDisabled={!userCanUpdateManager}
        />
      </Box>
      {userCanUpdateManager && (
        <Button
          mt="6"
          type="submit"
          maxW="240px"
          isLoading={isLoading}
          loadingText={t('Salvando...')}
        >
          {t('Salvar alterações')}
        </Button>
      )}
    </Flex>
  );
};
