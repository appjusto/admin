import { Box, BoxProps, Center, Image, Text } from '@chakra-ui/react';
import visionImg from 'common/img/collective-vision.png';
import { t } from 'utils/i18n';

export const CollectiveVision = (props: BoxProps) => {
  return (
    <Box {...props}>
      <Box mt="6" borderBottom="1px solid" borderColor="gray.400">
        <Text fontSize="xl" fontWeight="semibold">
          {t('Qual nosso objetivo coletivo para a sociedade?')}
        </Text>
        <Text mt="2">
          {t('Construir coletivamente uma')}
          <Text as="span" fontWeight="semibold">
            {t('alternativa contra a exploração e contra o monopólio')}
          </Text>
          {t(
            'no delivery, que seja realmente boa para toda a comunidade  que faz parte do processo:'
          )}
        </Text>
        <Center>
          <Image src={visionImg} alt="visão coletiva" maxW="540px" />
        </Center>
      </Box>
      <Box mt="6" borderBottom="1px solid" borderColor="gray.400" pb="8">
        <Text fontSize="xl" fontWeight="semibold">
          {t('Quais os compromissos da plataforma AppJusto?')}
        </Text>
        <Text mt="2">
          {t('i) Oferecer aos clientes ')}
          <Text as="span" fontWeight="semibold">
            {t('Restaurantes')}
          </Text>
          {t(' a melhor tecnologia de ')}
          <Text as="span" fontWeight="semibold">
            {t('plataforma com logística e pagamento')}
          </Text>
          {t(' possível, pelas menores taxas possíveis;')}
        </Text>
        <Text mt="4">
          {t('ii) Oferecer aos clientes ')}
          <Text as="span" fontWeight="semibold">
            {t('Entregadores')}
          </Text>
          {t(' autonomia por meio de ferramenta para a ')}
          <Text as="span" fontWeight="semibold">
            {t('auto-organização')}
          </Text>
          {t(
            ' em grupos (“frotas”) de interesse comum no quesito “preço do serviço” (valor mínimo e valor por km adicional), de forma a permitir '
          )}
          <Text as="span" fontWeight="semibold">
            {t('reconhecimento digno')}
          </Text>
          {t(
            ' por meio da remuneração do trabalho e transparência quando às regras da tecnologia que impactem a oferta de oportunidades de corrida;'
          )}
        </Text>
        <Text mt="4">
          {t('iii) Suporte/ organização da comunidade de ')}
          <Text as="span" fontWeight="semibold">
            {t('restaurantes, entregadores e consumidores')}
          </Text>
          {t(', de forma a permitir e engajar a realização da ')}
          <Text as="span" fontWeight="semibold">
            {t('construção conjunta do aumento de pedidos na plataforma;')}
          </Text>
        </Text>
        <Text mt="4">
          {t(
            'iv) Transparência total sobre as regras e usos da plataforma, e atendimento humano para a resolução de problemas.'
          )}
        </Text>
      </Box>
      <Box mt="6" borderBottom="1px solid" borderColor="gray.400" pb="8">
        <Text fontSize="xl" fontWeight="semibold">
          {t('Quais os compromissos dos Restaurantes?')}
        </Text>
        <Text mt="2">
          {t(
            'i) Operar com a maior eficiência e qualidade possíveis (e.g. equipe treinada, sistemas abertos e funcionando, cardápios atualizados, agilidade nos pedidos);'
          )}
        </Text>
        <Text mt="4">
          {t(
            'ii) Divulgar o link do cardápio do seu restaurante no appjusto em todas as suas mídias (redes sociais, site, whatsapp etc)  para potencializar o número de pedidos na plataforma;'
          )}
        </Text>
        <Text mt="4">
          {t(
            'iii) Fazer parte da comunidade de forma ativa: oferecer benefícios e cortesias aos consumidores (descontos, bonificações, por exemplo), e gentileza aos entregadores (água, uso do banheiro, fonte de energia para carregamento de celular).'
          )}
        </Text>
      </Box>
      <Box mt="6" borderBottom="1px solid" borderColor="gray.400" pb="8">
        <Text fontSize="xl" fontWeight="semibold">
          {t('Quais os compromissos dos Entregadores?')}
        </Text>
        <Text mt="2">
          {t(
            'i) Ter sempre em mente que tanto os consumidores quanto os restaurantes são também seus clientes, e tratá-los como tal: com gentileza e profissionalismo;'
          )}
        </Text>
        <Text mt="4">
          {t(
            'ii) Fazer parte da comunidade de forma ativa, retribuindo a gentileza dos restaurantes pelo uso das instalações (banheiro, água, energia para carregamento de celulares) ao demonstrar educação e profissionalismo com a manutenção das condições de limpeza encontradas nos locais utilizados, além de também apoiar o crescimento da plataforma ao divulgar o appjusto para mais restaurantes e outros entregadores.'
          )}
        </Text>
      </Box>
    </Box>
  );
};
