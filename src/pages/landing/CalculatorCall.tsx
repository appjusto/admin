import { Box, Text } from '@chakra-ui/react';
import { CustomButton } from 'common/components/buttons/CustomButton';
import Container from 'common/components/Container';
import { SectionHeading } from 'common/components/landing/SectionHeading';
import { t } from 'utils/i18n';
import { Content } from './Content';
import { Section } from './Section';

export const CalculatorCall = () => {
  return (
    <Section>
      <Container pt="16" color="black">
        <Content>
          <Box bgColor="#F6F6F6" borderRadius="16px" p="6">
            <SectionHeading>{t('Calcule seus ganhos')}</SectionHeading>
            <Text mb="6" fontSize="18px" lineHeight="26px" fontWeight="500">
              {t(
                'O AppJusto criou uma calculadora para auxiliar o seu restaurante a saber quanto irá economizar utilizando a nossa plataforma.'
              )}
            </Text>
            <CustomButton
              w={{ base: '100%', lg: '312px' }}
              fontSize="15px"
              lineHeight="21px"
              fontWeight="700"
              label={t('Calcular suas economias')}
              link="https://appjusto.com.br/calculadoras/restaurantes"
              isExternal
            />
          </Box>
        </Content>
      </Container>
    </Section>
  );
};
