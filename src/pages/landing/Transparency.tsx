import { Box, Flex, Image, Text } from '@chakra-ui/react';
import Container from 'common/components/Container';
import { SectionHeading } from 'common/components/landing/SectionHeading';
import logo from 'common/img/logo-black-white.svg';
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
            <Text mb="6" fontSize="18px" lineHeight="26px" fontWeight="500">
              {t('Compare as taxas cobradas e entenda por que você ganha mais ao usar o AppJusto:')}
            </Text>
            <Flex flexDir={{ base: 'column', xl: 'row' }}>
              <Box
                maxW={{ lg: '312px' }}
                h={{ base: 'auto', sm: '254px' }}
                bg="#6CE787"
                borderRadius="16px"
                p="6"
              >
                <Box>
                  <Image src={logo} width="120px" />
                </Box>
                <Text mt="4" fontSize="18px" lineHeight="26px" fontWeight="500">
                  {t('Relações mais justas começam com taxas mais justas para você')}
                </Text>
                <Text fontSize="5xl" fontWeight="700" lineHeight="5xl">
                  5%
                </Text>
                <Text fontSize="lg" lineHeight="26px">
                  {t('+ 2,42% da operadora financeira')}
                </Text>
              </Box>
              <Box
                mt={{ base: '4', xl: '0' }}
                ml={{ base: '0', xl: '4' }}
                maxW={{ lg: '312px' }}
                h={{ base: 'auto', sm: '254px' }}
                border="1px solid #DC3545"
                borderRadius="16px"
                p="6"
              >
                <Text mt="4" color="#DC3545" fontSize="2xl" fontWeight="700" lineHeight="26px">
                  {t('Outras plataformas')}
                </Text>
                <Text mt="6" fontSize="lg" lineHeight="26px">
                  {t('Outras plataformas com logística cobram até')}
                </Text>
                <Text color="#DC3545" fontSize="5xl" fontWeight="700" lineHeight="5xl">
                  27%
                </Text>
              </Box>
            </Flex>
          </Box>
        </Content>
      </Container>
    </Section>
  );
};
