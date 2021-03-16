import { Button, Flex, Link, Text } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { t } from 'utils/i18n';
import { OnboardingProps } from './onboarding/types';

interface Props extends OnboardingProps {
  isLoading?: boolean;
  deleteLabel?: string;
  onDelete?(): void;
}

const PageFooter = ({ onboarding, redirect, isLoading, deleteLabel, onDelete }: Props) => {
  return (
    <Flex mt="8" alignItems="center" justifyContent="space-between">
      <Button
        minW="200px"
        type="submit"
        size="lg"
        fontSize="sm"
        fontWeight="500"
        fontFamily="Barlow"
        isLoading={isLoading}
        loadingText={t('Salvando')}
      >
        {onboarding ? t('Salvar e continuar') : t('Salvar')}
      </Button>
      {!onboarding && deleteLabel && (
        <Button
          size="lg"
          fontSize="sm"
          variant="dangerLight"
          onClick={onDelete}
          isLoading={isLoading}
          loadingText={t('Excluindo')}
        >
          {deleteLabel}
        </Button>
      )}
      {onboarding && redirect && (
        <Link ml="8" as={RouterLink} to={redirect}>
          <Text textStyle="link">{t('Pular etapa e preencher depois')}</Text>
        </Link>
      )}
    </Flex>
  );
};

export default PageFooter;
