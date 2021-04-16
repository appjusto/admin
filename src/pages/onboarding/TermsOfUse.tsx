import { Button, Text } from '@chakra-ui/react';
import React from 'react';
import { Redirect } from 'react-router';

interface TermsProps {
  redirect: string;
}

export const TermsOfUse = ({ redirect }: TermsProps) => {
  const [accept, setAccept] = React.useState(false);
  if (accept && redirect) return <Redirect to={redirect} push />;
  return (
    <>
      <Text fontSize="2xl" fontWeight="700">
        Termos de uso
      </Text>
      <Button mt="8" onClick={() => setAccept(true)}>
        Aceitar
      </Button>
    </>
  );
};
