import { Box } from '@chakra-ui/react';
import { useObserveBusinessProfileNotes } from 'app/api/business/profile/useObserveBusinessProfileNotes';
import { useContextBusinessBackoffice } from 'app/state/business/businessBOContext';
import { ProfileNotes } from 'common/components/backoffice/ProfileNotes';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { BusinessPhoneField, BusinessPhones } from 'pages/business-profile/business-phones';
import { BusinessFulfillment } from 'pages/business-profile/BusinessFulfillment';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';
import BOBankingInformation from './forms/BOBankingInformation';
import { BOBusinessAddress } from './forms/BOBusinessAddress';
import { BOBusinessProfile } from './forms/BOBusinessProfile';

export const BusinessRegister = () => {
  // context
  const {
    business,
    handleBusinessProfileChange,
    handleBussinesPhonesChange,
    handleBusinessPhoneOrdering,
  } = useContextBusinessBackoffice();
  const { profileNotes, updateNote, deleteNote, updateResult, deleteResult } =
    useObserveBusinessProfileNotes(business?.id);
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
        handleOrdering={handleBusinessPhoneOrdering}
        isBackoffice
      />
      <SectionTitle>{t('Dados do restaurante')}</SectionTitle>
      <BOBusinessProfile />
      <BusinessFulfillment
        fulfillment={business?.fulfillment}
        handleChange={(value) => handleBusinessProfileChange('fulfillment', value)}
        isBackoffice
      />
      <SectionTitle>{t('Desconto médio')}</SectionTitle>
      <CustomInput
        id="bo-business-average-discount"
        label="Percentual de desconto"
        value={business?.averageDiscount ? business.averageDiscount.toString() : '0'}
        onChange={(e) => handleBusinessProfileChange('averageDiscount', parseInt(e.target.value))}
      />
      <SectionTitle>{t('Endereço')}</SectionTitle>
      <BOBusinessAddress />
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
