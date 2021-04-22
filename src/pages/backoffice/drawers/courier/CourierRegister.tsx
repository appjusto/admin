import { Box } from '@chakra-ui/react';
import { CourierProfile, WithId } from 'appjusto-types';
import React from 'react';
import { t } from 'utils/i18n';
import { Address } from '../generics/Address';
import { PersonalProfile } from '../generics/PersonalProfile';
import { ProfileBankingInfo } from '../generics/ProfileBankingInfo';
import { SectionTitle } from '../generics/SectionTitle';
import { Result, UpdateProfile } from '../generics/types';
import { ActingCity } from './ActingCity';
import { Documents } from './Documents';
import { Fleets } from './Fleets';

interface CourierRegisterProps {
  profile: WithId<CourierProfile> | null | undefined;
  updateProfile: UpdateProfile;
  result: Result;
}

export const CourierRegister = ({ profile, updateProfile, result }: CourierRegisterProps) => {
  // context
  const fleets = profile?.fleet ? [{ ...profile?.fleet }] : [];
  // UI
  return (
    <Box>
      <SectionTitle>{t('Dados pessoais')}</SectionTitle>
      <PersonalProfile profile={profile} updateProfile={updateProfile} result={result} isCNPJ />
      <SectionTitle>{t('Endereço')}</SectionTitle>
      <Address address={profile?.company} updateProfile={updateProfile} result={result} />
      <SectionTitle>{t('Fotos e documentos')}</SectionTitle>
      <Documents />
      <SectionTitle>{t('Dados bancários')}</SectionTitle>
      <ProfileBankingInfo
        bankingInfo={profile?.bankAccount}
        updateBankAccount={() => {}}
        result={result}
      />
      <SectionTitle>{t('Cidade de atuação')}</SectionTitle>
      <ActingCity />
      <SectionTitle>{t('Frota atual')}</SectionTitle>
      <Fleets fleets={fleets} />
    </Box>
  );
};
