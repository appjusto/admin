import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { CustomButton as Button } from 'common/components/buttons/CustomButton';
import Container from 'common/components/Container';
import { SectionHeading } from 'common/components/landing/SectionHeading';
import logo from 'common/img/logo.svg';
import { t } from 'utils/i18n';
import { Content } from './Content';
import { Section } from './Section';

export const Transparency = () => {
  return (
    <Section mt={{ base: '4', md: '24px' }}>
      <Container pt="16" color="black">
        <Content>
          <Box maxW={{ md: '312px', lg: '100%' }}>
            <SectionHeading>{t('Nosso preço é justo')}</SectionHeading>
            <Text mb="6">
              {t('Compare as taxas cobradas e entenda por que você ganha mais ao usar o AppJusto:')}
            </Text>
            <Flex flexDir={{ base: 'column', xl: 'row' }}>
              <Box
                maxW={{ lg: '312px' }}
                h={{ base: 'auto', sm: '254px' }}
                bg="#F2F6EA"
                border="2px solid black"
                p="4"
              >
                <Image src={logo} width="120px" />
                <Text mt="4" fontSize="lg" lineHeight="26px">
                  {t('Relações mais justas começam com taxas mais justas para você')}
                </Text>
                <Text fontSize="5xl" fontWeight="700" lineHeight="5xl">
                  5%
                </Text>
                <Text fontSize="lg" lineHeight="26px">
                  {t('+ 2,21% da operadora financeira')}
                </Text>
              </Box>
              <Box
                mt={{ base: '4', xl: '0' }}
                ml={{ base: '0', xl: '4' }}
                maxW={{ lg: '312px' }}
                h={{ base: 'auto', sm: '254px' }}
                border="2px solid black"
                p="4"
              >
                <Text mt="4" fontSize="2xl" fontWeight="700" lineHeight="26px">
                  {t('Outras plataformas')}
                </Text>
                <Text mt="6" fontSize="lg" lineHeight="26px">
                  {t('Outras plataformas com logística cobram até')}
                </Text>
                <Text fontSize="5xl" fontWeight="700" lineHeight="5xl">
                  27%
                </Text>
              </Box>
            </Flex>
            <Button
              mt="6"
              w={{ base: '100%', lg: '312px' }}
              maxW="340px"
              py="2"
              size="lg"
              fontFamily="barlow"
              fontSize="sm"
              label={t('Conhecer mais sobre o AppJusto')}
              link="https://appjusto.com.br/"
              isExternal
            />
          </Box>
        </Content>
      </Container>
    </Section>
  );
};
