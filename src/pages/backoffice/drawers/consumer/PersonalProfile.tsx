import { ProfileTag } from '@appjusto/types';
import { Box, Text } from '@chakra-ui/react';
import * as cpfutils from '@fnando/cpf';
import { useConsumerUpdateProfile } from 'app/api/consumer/useConsumerUpdateProfile';
import { useObserveConsumerProfileNotes } from 'app/api/consumer/useObserveConsumerProfileNotes';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextConsumerProfile } from 'app/state/consumer/context';
import { ProfileNotes } from 'common/components/backoffice/ProfileNotes';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { CustomPatternInput } from 'common/components/form/input/pattern-input/CustomPatternInput';
import {
  cpfFormatter,
  cpfMask,
  phoneFormatter,
  phoneMask,
} from 'common/components/form/input/pattern-input/formatters';
import { numbersOnlyParser } from 'common/components/form/input/pattern-input/parsers';
import { UserNotificationPreferences } from 'common/components/UserNotificationPreferences';
import React from 'react';
import { normalizeEmail } from 'utils/email';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';
import { ProfileTags } from '../ProfileTags';

export const PersonalProfile = () => {
  // context
  const { userAbility } = useContextFirebaseUser();
  const { consumer, handleProfileChange, isEditingEmail, setIsEditingEmail } =
    useContextConsumerProfile();
  const { updateProfile, updateResult: updateProfileResult } =
    useConsumerUpdateProfile(consumer?.id);
  const { profileNotes, updateNote, deleteNote, updateResult, deleteResult } =
    useObserveConsumerProfileNotes(consumer?.id);
  // refs
  const nameRef = React.useRef<HTMLInputElement>(null);
  const cpfRef = React.useRef<HTMLInputElement>(null);
  const phoneNumberRef = React.useRef<HTMLInputElement>(null);
  // helpers
  const isCPFValid = () => cpfutils.isValid(consumer?.cpf!);
  // handlers
  const handleInputChange = (field: string, value: string | string[]) => {
    return handleProfileChange(field, value);
  };
  // UI
  return (
    <Box>
      <SectionTitle>{t('Dados pessoais')}</SectionTitle>
      {isEditingEmail ? (
        <Box>
          <Text
            textAlign="end"
            color="red"
            textDecor="underline"
            cursor="pointer"
            onClick={() => setIsEditingEmail(false)}
          >
            {t('Desativar edição')}
          </Text>
          <CustomInput
            mt="2"
            id="user-profile-email"
            label={t('E-mail')}
            value={consumer?.email ?? ''}
            onChange={(ev) =>
              handleInputChange('email', normalizeEmail(ev.target.value))
            }
          />
        </Box>
      ) : (
        <Box>
          <Text
            display={userAbility?.can('update', 'consumers') ? 'block' : 'none'}
            textAlign="end"
            color="green.600"
            textDecor="underline"
            cursor="pointer"
            onClick={() => setIsEditingEmail(true)}
          >
            {t('Editar email')}
          </Text>
          <CustomInput
            mt="2"
            id="user-profile-email"
            label={t('E-mail')}
            value={consumer?.email ?? ''}
            isDisabled
          />
        </Box>
      )}
      <CustomInput
        isRequired
        id="user-profile-name"
        ref={nameRef}
        label={t('Nome')}
        placeholder={t('Nome')}
        value={consumer?.name ?? ''}
        onChange={(ev) => handleInputChange('name', ev.target.value)}
      />
      <CustomInput
        isRequired
        id="user-profile-lastname"
        label={t('Sobrenome')}
        placeholder={t('Sobrenome')}
        value={consumer?.surname ?? ''}
        onChange={(ev) => handleInputChange('surname', ev.target.value)}
      />
      <CustomPatternInput
        isRequired
        ref={phoneNumberRef}
        id="user-phone"
        label={t('Celular')}
        placeholder={t('Número do celular')}
        mask={phoneMask}
        parser={numbersOnlyParser}
        formatter={phoneFormatter}
        value={consumer?.phone ?? ''}
        onValueChange={(value) => handleInputChange('phone', value)}
        validationLength={11}
      />
      <CustomPatternInput
        isRequired
        ref={cpfRef}
        id="user-cpf"
        label={t('CPF')}
        placeholder={t('Número do CPF')}
        mask={cpfMask}
        parser={numbersOnlyParser}
        formatter={cpfFormatter}
        value={consumer?.cpf ?? ''}
        onValueChange={(value) => handleInputChange('cpf', value)}
        externalValidation={{ active: true, status: isCPFValid() }}
      />
      <SectionTitle>{t('Preferências de notificação')}</SectionTitle>
      <UserNotificationPreferences
        notificationPreferences={consumer?.notificationPreferences}
        handlePreferenciesChange={(values) => {
          handleInputChange('notificationPreferences', values);
        }}
      />
      <SectionTitle>{t('Tags')}</SectionTitle>
      <ProfileTags
        tags={consumer?.tags}
        options={['safe'] as ProfileTag[]}
        updateProfile={(tags) =>
          updateProfile({
            changes: { tags },
            selfieFileToSave: null,
            documentFileToSave: null,
          })
        }
        isLoading={updateProfileResult.isLoading}
        isSuccess={updateProfileResult.isSuccess}
      />
      <SectionTitle>{t('Anotações')}</SectionTitle>
      <ProfileNotes
        profileNotes={profileNotes}
        updateNote={updateNote}
        deleteNote={deleteNote}
        updateResult={updateResult}
        deleteResult={deleteResult}
      />
    </Box>
  );
};
