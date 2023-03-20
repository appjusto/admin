import { Box, Button, Flex, Heading, Link, Text } from '@chakra-ui/react';
import 'github-markdown-css';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';

interface CommitmentProps {
  index: number;
  description: string;
}

const Commitment = ({ index, description }: CommitmentProps) => {
  return (
    <Flex mt="6">
      <Box minW="24px">
        <Text fontSize="16px" fontWeight="500" color="black">
          {index}.
        </Text>
      </Box>
      <Box ml="4">
        <Text fontSize="16px" fontWeight="500">
          {description}
        </Text>
      </Box>
    </Flex>
  );
};

const commitmentsData = [
  'Ser justo também com seu cliente, praticando preços menores do que em outras plataformas.',
  'Manter equipe sempre treinada, para uma melhor eficiência operacional e experiência dos clientes, alcançando o maior crescimento possível.',
  'Manter a loja aberta no horário definido, aceitar os pedidos com agilidade e manter o cardápio atualizado com itens disponíveis e preços corretos.',
  'Ajudar no aumento de pedidos, divulgando seu link do AppJusto nas redes socais e Whatsapp e convidando mais restaurantes para a plataforma.',
  'Contribuir com a melhoria do AppJusto, informando educadamente caso identifique algum problema ou oportunidade de melhoria na plataforma ou operação.',
  'Respeitar a coletividade, disponibilizando água, banheiro e lugares de espera adequados aos entregadores, sempre que possível.',
];

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
        {t('Compromissos')}
      </Heading>
      <Text mt="8">
        {t(
          'Nosso compromisso, enquanto negócio social, é disponibilizar uma plataforma de marketplace com logística, que pratica as menores taxas possíveis, com igualdade e transparência.'
        )}
      </Text>
      <Text mt="4">
        {t(
          'Destacamos aqui, os principais compromissos que esperamos dos restaurantes na construção desse movimento por uma alternativa realmente boa para todos.'
        )}
      </Text>
      {commitmentsData.map((commitment, index) => (
        <Commitment
          key={commitment}
          index={index + 1}
          description={commitment}
        />
      ))}
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
