import { Box } from '@chakra-ui/react';
import { useObserveBusinessProfileNotes } from 'app/api/business/profile/useObserveBusinessProfileNotes';
import { useContextBusinessBackoffice } from 'app/state/business/businessBOContext';
import { ProfileNotes } from 'common/components/backoffice/ProfileNotes';
import { BusinessPhoneField, BusinessPhones } from 'pages/business-profile/business-phones';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';
import BOBankingInformation from './forms/BOBankingInformation';
import { BOManagerProfile } from './forms/BOManagerProfile';

export const BusinessRegister = () => {
  // context
  const { business, handleBussinesPhonesChange } = useContextBusinessBackoffice();
  const {
    profileNotes,
    updateNote,
    deleteNote,
    updateResult,
    deleteResult,
  } = useObserveBusinessProfileNotes(business?.id);
  // UI
  return (
    <Box>
      <BusinessPhones
        phones={business?.phones ?? []}
        addPhone={() => handleBussinesPhonesChange('add')}
        removePhone={(index) => handleBussinesPhonesChange('remove', index)}
        handlePhoneUpdate={(index: number, field: BusinessPhoneField, value: any) =>
          handleBussinesPhonesChange('update', { index, field, value })
        }
        isBackoffice
      />
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
