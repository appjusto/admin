import { Button, Text } from '@chakra-ui/react';
import { useTerms } from 'app/api/business/terms/useTerms';
import 'github-markdown-css';
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

  // side effects
  React.useEffect(() => {
    window?.scrollTo(0, 0);
  }, []);

  React.useEffect(() => {
    if (formattedTerms) setTerms(formattedTerms);
  }, [formattedTerms]);

  // UI
  if (accept && redirect) return <Redirect to={redirect} push />;
  return (
    <>
      {terms ? (
        <Markdown className="markdown-body" children={terms} />
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
