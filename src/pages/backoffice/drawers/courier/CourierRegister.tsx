import { Box } from '@chakra-ui/react';
import React from 'react';
import { t } from 'utils/i18n';
import { Address } from '../generics/Address';
import { PersonalProfile } from '../generics/PersonalProfile';
import { ProfileBankingInfo } from '../generics/ProfileBankingInfo';
import { SectionTitle } from '../generics/SectionTitle';
import { ActingCity } from './ActingCity';
import { Documents } from './Documents';
import { Fleets } from './Fleets';

export const CourierRegister = () => {
  // context
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
    </Box>
  );
};
