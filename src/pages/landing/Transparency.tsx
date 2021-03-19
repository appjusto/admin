import { Box, HStack, Image, Text } from '@chakra-ui/react';
import { CustomButton as Button } from 'common/components/buttons/CustomButton';
import Container from 'common/components/Container';
import { SectionHeading } from 'common/components/landing/SectionHeading';
import logo from 'common/img/logo.svg';
import { t } from 'utils/i18n';
import { Section } from './Section';

export const Transparency = () => {
  return (
    <Section>
      <Container pt="16" color="black">
        <SectionHeading>{t('Somos transparentes do início ao fim')}</SectionHeading>
        <Text mb="6">
          {t('Compare as taxas cobradas e entenda por que você ganha mais ao usar o AppJusto:')}
        </Text>
        <HStack spacing={4}>
          <Box maxW="312px" h="253px" bg="#F2F6EA" border="2px solid black" p="4">
            <Image src={logo} width="120px" />
            <Text mt="4" fontSize="lg" lineHeight="26px">
              {t('Relações mais justas começam com taxas mais justas para você')}
            </Text>
            <Text fontSize="5xl" fontWeight="700" lineHeight="5xl">
              5%
            </Text>
            <Text fontSize="lg" lineHeight="26px">
              {t('+ R$ 50 de mensalidade')}
            </Text>
          </Box>
          <Box maxW="312px" h="253px" border="2px solid black" p="4">
            <Text mt="4" fontSize="2xl" fontWeight="700" lineHeight="26px">
              {t('Outras plataformas')}
            </Text>
            <Text mt="6" fontSize="lg" lineHeight="26px">
              {t('Esse é o valor médio de quanto você paga para os concorrentes')}
            </Text>
            <Text fontSize="5xl" fontWeight="700" lineHeight="5xl">
              27%
            </Text>
            <Text fontSize="lg" lineHeight="26px">
              {t('+ R$ 100 de mensalidade')}
            </Text>
          </Box>
        </HStack>
        <Button
          mt="6"
          label={t('Conhecer mais sobre o AppJusto')}
          link="https://appjusto.com.br/"
          isExternal
        />
      </Container>
    </Section>
  );
};
