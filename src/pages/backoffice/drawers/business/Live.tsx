import { Button, Flex, Radio, RadioGroup, Text } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { BusinessStatus } from 'appjusto-types';
import { AlertError } from 'common/components/AlertError';
import { AlertSuccess } from 'common/components/AlertSuccess';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

interface BusinessLiveProps {
  status: BusinessStatus | undefined;
  enabled: boolean | undefined;
}

export const BusinessLive = ({ status, enabled }: BusinessLiveProps) => {
  // context
  const { updateBusinessProfile, updateResult: result } = useBusinessProfile();
  const { isLoading, isSuccess, isError } = result;
  // state
  const [isOpen, setIsOpen] = React.useState<BusinessStatus>('closed');
  const [isEnabled, setIsEnabled] = React.useState('false');

  // handlers
  // handleSubmit => updateBusinessProfile with id
  const onSubmitHandler = () => {
    updateBusinessProfile({
      status: isOpen,
      enabled: isEnabled === 'true' ? true : false,
    });
  };

  // side effects
  React.useEffect(() => {
    if (status) setIsOpen(status);
  }, [status]);
  React.useEffect(() => {
    if (enabled) setIsEnabled(enabled.toString());
  }, [enabled]);
  // UI
  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        onSubmitHandler();
      }}
    >
      <SectionTitle mt="0">{t('Restaurante agora:')}</SectionTitle>
      <RadioGroup
        mt="2"
        onChange={(value) => setIsOpen(value as BusinessStatus)}
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
      <Button
        mt="8"
        minW="200px"
        type="submit"
        size="lg"
        fontSize="sm"
        fontWeight="500"
        fontFamily="Barlow"
        isLoading={isLoading}
        loadingText={t('Salvando')}
      >
        {t('Salvar')}
      </Button>
      {isSuccess && (
        <AlertSuccess maxW="426px" title={t('Informações salvas com sucesso!')} description={''} />
      )}
      {isError && (
        <AlertError
          maxW="426px"
          title={t('Erro')}
          description={'Não foi possível acessar o servidor. Tenta novamente?'}
        />
      )}
    </form>
  );
};
