import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text,
} from '@chakra-ui/react';
import Container from 'common/components/Container';
import { SectionHeading } from 'common/components/landing/SectionHeading';
import { t } from 'utils/i18n';
import { Section } from './Section';

export const FAQs = () => {
  return (
    <Section>
      <Container pt="16">
        <SectionHeading>{t('Perguntas frequentes')}</SectionHeading>
        <Text mb="2" color="black">
          {t('Tire suas dúvidas sobre o AppJusto e faça parte desse movimento:')}
        </Text>
        <Accordion maxW="656px" defaultIndex={[0]} allowMultiple>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left" color="black">
                  {t('Como surgiu a ideia de criar o AppJusto?')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              {t(
                'Durante a pandemia de 2020 o serviço de entregas se tornou essencial. Ao mesmo tempo, tanto entregadores quanto restaurantes estavam muito insatisfeitos com as condições impostas pelas plataformas. Ficou claro que era preciso criar uma alternativa mais justa.'
              )}
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left" color="black">
                  {t('Como surgiu a ideia de criar o AppJusto?')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              {t(
                'Durante a pandemia de 2020 o serviço de entregas se tornou essencial. Ao mesmo tempo, tanto entregadores quanto restaurantes estavam muito insatisfeitos com as condições impostas pelas plataformas. Ficou claro que era preciso criar uma alternativa mais justa.'
              )}
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left" color="black">
                  {t('Como surgiu a ideia de criar o AppJusto?')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              {t(
                'Durante a pandemia de 2020 o serviço de entregas se tornou essencial. Ao mesmo tempo, tanto entregadores quanto restaurantes estavam muito insatisfeitos com as condições impostas pelas plataformas. Ficou claro que era preciso criar uma alternativa mais justa.'
              )}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Container>
    </Section>
  );
};
