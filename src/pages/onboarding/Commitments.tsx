import { Box, Button, Heading, Link, Text } from '@chakra-ui/react';
import 'github-markdown-css';
import { CollectiveVision } from 'pages/home/CollectiveVision';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';

interface CommitmentsProps {
  redirect: string;
}

export const Commitments = ({ redirect }: CommitmentsProps) => {
  // state
  const [accept, setAccept] = React.useState(false);
  // side effects
  React.useEffect(() => {
    window?.scrollTo(0, 0);
  }, []);
  // UI
  if (accept && redirect) return <Redirect to={redirect} push />;
  return (
    <Box maxW="600px">
      <Heading color="black" fontSize="2xl" mt="4">
        {t('Visão coletiva e compromissos')}
      </Heading>
      <Text mt="2">
        {t(
          'Alinhamento de expectativas para a construção de uma comunidade forte, engajada e com bons resultados'
        )}
      </Text>
      <CollectiveVision />
      <Text mt="6">
        {t('Veja a íntegra dos compromissos nos nossos ')}
        <Link
          href="https://github.com/appjusto/docs/blob/main/legal/termos-de-uso-restaurantes.md"
          fontWeight="700"
          textDecor="underline"
          isExternal
        >
          {t('termos de uso.')}
        </Link>
      </Text>
      <Button mt="12" fontSize="sm" onClick={() => setAccept(true)}>
        {t('Concordar e prosseguir')}
      </Button>
    </Box>
  );
};
