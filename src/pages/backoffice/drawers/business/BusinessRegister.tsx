import { Box } from '@chakra-ui/react';
import { useObserveBusinessProfileNotes } from 'app/api/business/profile/useObserveBusinessProfileNotes';
import { useContextBusinessId } from 'app/state/business/context';
import { ProfileNotes } from 'common/components/backoffice/ProfileNotes';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';
import BOBankingInformation from './forms/BOBankingInformation';
import { BOManagerProfile } from './forms/BOManagerProfile';

export const BusinessRegister = () => {
  // context
  const businessId = useContextBusinessId();
  const {
    profileNotes,
    updateNote,
    deleteNote,
    updateResult,
    deleteResult,
  } = useObserveBusinessProfileNotes(businessId);
  // UI
  return (
    <Box>
      <SectionTitle>{t('Dados pessoais')}</SectionTitle>
      <BOManagerProfile />
      <SectionTitle>{t('Dados bancários')}</SectionTitle>
      <BOBankingInformation />
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
