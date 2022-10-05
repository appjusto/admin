import { Box } from '@chakra-ui/react';
import { useCourierUpdateProfile } from 'app/api/courier/useCourierUpdateProfile';
import { useObserveCourierProfileNotes } from 'app/api/courier/useObserveCourierProfileNotes';
import { useContextCourierProfile } from 'app/state/courier/context';
import { ProfileNotes } from 'common/components/backoffice/ProfileNotes';
import { UserNotificationPreferences } from 'common/components/UserNotificationPreferences';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';
import { ProfileTags } from '../ProfileTags';
import { ActingCity } from './ActingCity';
import { Documents } from './Documents';
import { Fleets } from './Fleets';
import { Address } from './register/Address';
import { PersonalProfile } from './register/PersonalProfile';
import { ProfileBankingInfo } from './register/ProfileBankingInfo';

export const CourierRegister = () => {
  // context
  const { courier, handleProfileChange } = useContextCourierProfile();
  const { updateProfile, updateResult: updateProfileResult } =
    useCourierUpdateProfile(courier?.id);
  const { profileNotes, updateNote, deleteNote, updateResult, deleteResult } =
    useObserveCourierProfileNotes(courier?.id);
  // UI
  return (
    <Box>
      <SectionTitle>{t('Dados pessoais')}</SectionTitle>
      <PersonalProfile isCNPJ />
      <SectionTitle>{t('Endereço')}</SectionTitle>
      <Address />
      <SectionTitle>{t('Fotos e documentos')}</SectionTitle>
      <Documents />
      <SectionTitle>{t('Dados bancários')}</SectionTitle>
      <ProfileBankingInfo />
      <SectionTitle>{t('Cidade de atuação')}</SectionTitle>
      <ActingCity />
      <SectionTitle>{t('Frota atual')}</SectionTitle>
      <Fleets />
      <SectionTitle>{t('Preferências de notificação')}</SectionTitle>
      <UserNotificationPreferences
        notificationPreferences={courier?.notificationPreferences}
        handlePreferenciesChange={(values) =>
          handleProfileChange('notificationPreferences', values)
        }
      />
      <SectionTitle>{t('Tags')}</SectionTitle>
      <ProfileTags
        profile={courier}
        updateProfile={(tags: string[]) =>
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
