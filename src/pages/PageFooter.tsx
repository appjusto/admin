import { Button, Flex, Link, Text } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { t } from 'utils/i18n';
import { OnboardingProps } from './onboarding/types';

interface Props extends OnboardingProps {
  isLoading?: boolean;
  onSubmit?: () => Promise<void>;
}

const PageFooter = ({ onboarding, redirect, isLoading, onSubmit }: Props) => {
  return (
    <Flex mt="4" alignItems="center">
      <Button
        type="submit"
        size="lg"
        fontSize="sm"
        fontWeight="500"
        fontFamily="Barlow"
        //onClick={onSubmit}
        isLoading={isLoading}
        loadingText={t('Salvando')}
      >
        {onboarding ? t('Salvar e continuar') : t('Salvar')}
      </Button>
      {onboarding && redirect && (
        <Link ml="8" as={RouterLink} to={redirect}>
          <Text textStyle="link">{t('Pular etapa e preencher depois')}</Text>
        </Link>
      )}
    </Flex>
  );
};

export default PageFooter;
