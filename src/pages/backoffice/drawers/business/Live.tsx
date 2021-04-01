import { Flex, Radio, RadioGroup, Text } from '@chakra-ui/react';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../SectionTitle';

interface BusinessLiveProps {
  status: string | undefined;
  enabled: boolean | undefined;
}

export const BusinessLive = ({ status, enabled }: BusinessLiveProps) => {
  // context

  // state
  const [isOpen, setIsOpen] = React.useState('closed');
  const [isEnabled, setIsEnabled] = React.useState('false');

  // handlers
  // handleSubmit => updateBusinessProfile with id

  // side effects
  React.useEffect(() => {
    if (status) setIsOpen(status);
  }, [status]);
  React.useEffect(() => {
    if (enabled) setIsEnabled(enabled.toString());
  }, [enabled]);
  // UI
  return (
    <>
      <SectionTitle mt="0">{t('Restaurante agora:')}</SectionTitle>
      <RadioGroup
        mt="2"
        onChange={(value) => setIsOpen(value.toString())}
        value={isOpen}
        defaultValue="1"
        colorScheme="green"
        color="black"
        fontSize="15px"
        lineHeight="21px"
      >
        <Flex flexDir="column" justifyContent="flex-start">
          <Radio mt="2" value="open">
            {t('Aberto')}
          </Radio>
          <Radio mt="2" value="closed">
            {t('Fechado')}
          </Radio>
        </Flex>
      </RadioGroup>
      <SectionTitle>{t('Desligar restaurante do AppJusto:')}</SectionTitle>
      <Text fontSize="15px" lineHeight="21px">
        {t('Ao desligar o restaurante, ele não aparecerá no app enquanto estiver desligado')}
      </Text>
      <RadioGroup
        mt="2"
        onChange={(value) => setIsEnabled(value.toString())}
        value={isEnabled}
        defaultValue="1"
        colorScheme="green"
        color="black"
        fontSize="15px"
        lineHeight="21px"
      >
        <Flex flexDir="column" justifyContent="flex-start">
          <Radio mt="2" value="true">
            {t('Ligado')}
          </Radio>
          <Radio mt="2" value="false">
            {t('Desligado')}
          </Radio>
        </Flex>
      </RadioGroup>
    </>
  );
};
