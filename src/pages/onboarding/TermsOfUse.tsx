import { Button, Text } from '@chakra-ui/react';
import { useTerms } from 'app/api/business/terms/useTerms';
import React from 'react';
import Markdown from 'react-markdown';
import { Redirect } from 'react-router';
import { t } from 'utils/i18n';

interface TermsProps {
  redirect: string;
}

export const TermsOfUse = ({ redirect }: TermsProps) => {
  // context
  const formattedTerms = useTerms();
  // state
  const [accept, setAccept] = React.useState(false);
  const [terms, setTerms] = React.useState<string>();

  // helpers
  const parser = new DOMParser();

  // side effects
  React.useEffect(() => {
    if (formattedTerms) setTerms(formattedTerms);
  }, [formattedTerms]);

  // UI
  if (accept && redirect) return <Redirect to={redirect} push />;
  return (
    <>
      <Text fontSize="2xl" fontWeight="700" mb="4">
        Termos de uso
      </Text>
      {terms ? (
        <Markdown children={terms} />
      ) : (
        <Text>
          {t(
            'Para ler os termos, favor acessar o arquivo: https://github.com/appjusto/docs/blob/main/legal/termos-de-uso-restaurantes.md'
          )}
        </Text>
      )}
      <Button mt="8" onClick={() => setAccept(true)}>
        {t('Confirmar e criar minha conta')}
      </Button>
    </>
  );
};
