import { BusinessTag } from '@appjusto/types';
import { Box, Text } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useObserveBusinessProfileNotes } from 'app/api/business/profile/useObserveBusinessProfileNotes';
import { useContextBusinessBackoffice } from 'app/state/business/businessBOContext';
import { ProfileNotes } from 'common/components/backoffice/ProfileNotes';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { CustomNumberInput as NumberInput } from 'common/components/form/input/CustomNumberInput';
import {
  BusinessPhoneField,
  BusinessPhones,
} from 'pages/business-profile/business-phones';
import { BusinessFulfillment } from 'pages/business-profile/BusinessFulfillment';
import { BusinessPreparationModes } from 'pages/business-profile/BusinessPreparationModes';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';
import { ProfileTags } from '../ProfileTags';
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
  const { updateBusinessProfile, updateResult: updateProfilteResult } =
    useBusinessProfile(business?.id);
  const { profileNotes, updateNote, deleteNote, updateResult, deleteResult } =
    useObserveBusinessProfileNotes(business?.id);
  // UI
  return (
    <Box>
      <BusinessPhones
        phones={business?.phones ?? []}
        addPhone={() => handleBussinesPhonesChange('add')}
        removePhone={(index) => handleBussinesPhonesChange('remove', index)}
        handlePhoneUpdate={(
          index: number,
          field: BusinessPhoneField,
          value: any
        ) => handleBussinesPhonesChange('update', { index, field, value })}
        handleOrdering={handleBusinessPhoneOrdering}
        isBackoffice
      />
      <SectionTitle>{t('Dados do restaurante')}</SectionTitle>
      <BOBusinessProfile />
      <BusinessPreparationModes
        preparationModes={business?.preparationModes}
        handleChange={(value) =>
          handleBusinessProfileChange('preparationModes', value)
        }
        isBackoffice
      />
      <SectionTitle>{t('Máximo de pedidos por hora')}</SectionTitle>
      <Text mt="1" fontSize="md">
        {t('Usar "0" para desativado')}
      </Text>
      <NumberInput
        id="business-max-order-per-hour"
        label={t('Número máximo de pedidos por hora')}
        value={String(business?.maxOrdersPerHour ?? '')}
        onChange={(e) =>
          handleBusinessProfileChange(
            'maxOrdersPerHour',
            parseInt(e.target.value, 10)
          )
        }
      />
      <SectionTitle>
        {t('Mínimo de horas de antecedência para pedidos agendados')}
      </SectionTitle>
      <Text mt="1" fontSize="md">
        {t('Usar "0" para desativado')}
      </Text>
      <NumberInput
        id="business-min-hours"
        label={t('Número mínimo de horas')}
        value={String(business?.minHoursForScheduledOrders ?? '')}
        onChange={(e) =>
          handleBusinessProfileChange(
            'minHoursForScheduledOrders',
            parseInt(e.target.value, 10)
          )
        }
      />
      <BusinessFulfillment
        fulfillment={business?.fulfillment}
        handleChange={(value) =>
          handleBusinessProfileChange('fulfillment', value)
        }
        isBackoffice
      />
      <SectionTitle>{t('% Preço Justo')}</SectionTitle>
      <CustomInput
        id="bo-business-average-discount"
        label="repasse do restaurante"
        value={
          business?.averageDiscount ? business.averageDiscount.toString() : '0'
        }
        onChange={(e) =>
          handleBusinessProfileChange(
            'averageDiscount',
            parseInt(e.target.value)
          )
        }
      />
      <SectionTitle>{t('Endereço')}</SectionTitle>
      <BOBusinessAddress />
      <SectionTitle>{t('Dados bancários')}</SectionTitle>
      <BOBankingInformation />
      <SectionTitle>{t('Tags')}</SectionTitle>
      <ProfileTags
        tags={business?.tags}
        options={
          [
            'safe',
            'can-match-courier',
            'can-outsource',
            'motorcycle-only',
            'appjusto-only',
            'investor',
            'cultural-fit',
            'in-person-onboarding',
            'link-on-social',
            'ads',
            'consumer-home',
            'consumer-home-mousse',
            'dispatch-by-courier',
          ] as BusinessTag[]
        }
        updateProfile={(tags) => updateBusinessProfile({ tags })}
        isLoading={updateProfilteResult.isLoading}
        isSuccess={updateProfilteResult.isSuccess}
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
