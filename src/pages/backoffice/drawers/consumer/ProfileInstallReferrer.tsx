import { InstallReferrer } from '@appjusto/types';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useContextConsumerProfile } from 'app/state/consumer/context';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

export const ProfileInstallReferrer = () => {
  // context
  const {
    consumer,
    isInstallationReferred,
    handleProfileInstallReferrerChange,
  } = useContextConsumerProfile();
  // handlers
  const handleInputChange = (field: keyof InstallReferrer, value: string) => {
    if (isInstallationReferred) return;
    return handleProfileInstallReferrerChange(field, value);
  };
  // UI
  return (
    <Box>
      <SectionTitle>{t('Install referrer')}</SectionTitle>
      <Flex mt="2" justifyContent="space-between">
        <Flex fontSize="sm" gap="1">
          <Text>{t('Instalado em:')}</Text>
          <Text>{getDateAndHour(consumer?.installReferrer?.installedAt)}</Text>
        </Flex>
        <Flex fontSize="sm" gap="1">
          <Text>{t('Atualizado em:')}</Text>
          <Text>{getDateAndHour(consumer?.installReferrer?.updatedAt)}</Text>
        </Flex>
      </Flex>
      <CustomInput
        id="utm_campaign"
        label={t('utm_campaign')}
        placeholder={t('utm_campaign')}
        value={consumer?.installReferrer?.utm_campaign ?? ''}
        onChange={(ev) => handleInputChange('utm_campaign', ev.target.value)}
        isDisabled={isInstallationReferred}
      />
      <CustomInput
        id="utm_medium"
        label={t('utm_medium')}
        placeholder={t('utm_medium')}
        value={consumer?.installReferrer?.utm_medium ?? ''}
        onChange={(ev) => handleInputChange('utm_medium', ev.target.value)}
        isDisabled={isInstallationReferred}
      />
      <CustomInput
        id="utm_source"
        label={t('utm_source')}
        placeholder={t('utm_source')}
        value={consumer?.installReferrer?.utm_source ?? ''}
        onChange={(ev) => handleInputChange('utm_source', ev.target.value)}
        isDisabled={isInstallationReferred}
      />
    </Box>
  );
};
