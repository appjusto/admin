import { Button, Text } from '@chakra-ui/react';
import { useTerms } from 'app/api/business/terms/useTerms';
import React from 'react';
import { Redirect } from 'react-router';

interface TermsProps {
  redirect: string;
}

export const TermsOfUse = ({ redirect }: TermsProps) => {
  // context
  const formattedTerms = useTerms();
  // state
  const [accept, setAccept] = React.useState(false);
  const [terms, setTerms] = React.useState('');

  // side effects
  React.useEffect(() => {
    if (formattedTerms) setTerms(formattedTerms);
  }, [formattedTerms]);

  // UI
  if (accept && redirect) return <Redirect to={redirect} push />;
  return (
    <>
      <Text fontSize="2xl" fontWeight="700">
        Termos de uso
      </Text>
      {terms}
      <Button mt="8" onClick={() => setAccept(true)}>
        Aceitar
      </Button>
    </>
  );
};
