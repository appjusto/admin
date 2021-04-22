import { Box } from '@chakra-ui/react';
import React from 'react';
import { t } from 'utils/i18n';
import { Address } from '../generics/Address';
import { PersonalProfile } from '../generics/PersonalProfile';
import { ProfileBankingInfo } from '../generics/ProfileBankingInfo';
import { SectionTitle } from '../generics/SectionTitle';
import { PersonalProfileProps } from '../generics/types';
import { ActingCity } from './ActingCity';
import { Documents } from './Documents';
import { Fleets } from './Fleets';

export const CourierRegister = ({ profile, updateProfile, result }: PersonalProfileProps) => {
  // context

  // UI
  return (
    <Box>
      <SectionTitle>{t('Dados pessoais')}</SectionTitle>
      <PersonalProfile profile={profile} updateProfile={updateProfile} result={result} />
      <SectionTitle>{t('Endereço')}</SectionTitle>
      <Address address={profile?.userAddress} updateProfile={updateProfile} result={result} />
      <SectionTitle>{t('Fotos e documentos')}</SectionTitle>
      <Documents />
      <SectionTitle>{t('Dados bancários')}</SectionTitle>
      <ProfileBankingInfo bankingInfo={undefined} updateBankAccount={() => {}} result={result} />
      <SectionTitle>{t('Cidade de atuação')}</SectionTitle>
      <ActingCity />
      <SectionTitle>{t('Frota atual')}</SectionTitle>
      <Fleets />
    </Box>
  );
};
