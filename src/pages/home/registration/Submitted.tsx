import { Box, HStack, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { BsCheckCircle } from 'react-icons/bs';
import { t } from 'utils/i18n';
import { Collective } from '../dashboard/communication/Collective';
import { MainVideo } from '../dashboard/communication/MainVideo';

export const Submitted = () => {
  React.useEffect(() => {
    window?.scrollTo(0, 0);
  }, []);
  return (
    <Box mt="6">
      <Box border="1px solid #B8E994" borderRadius="lg" bgColor="#F2FFE8" p="4">
        <HStack color="green.600" fontSize="xl" fontWeight="semibold">
          <Icon as={BsCheckCircle} />
          <Text>{t('Recebemos seu cadastro!')}</Text>
        </HStack>
        <Text mb="1">
          {t('Vamos analisá-lo e te responder por ')}
          <Text as="span" fontWeight="semibold">
            {t('email em até 2 dias úteis.')}
          </Text>
        </Text>
      </Box>
      <MainVideo />
      <Collective />
      <Box mt="6" bgColor="#D7E7DA" borderRadius="lg" px="4" py="6">
        <Text fontSize="xl" fontWeight="semibold">
          {t(
            'Acreditamos que um produto ou serviço só é bom de verdade quando é bom pra todos que fazem parte dele. Bora construir essa alternativa? ✊'
          )}
        </Text>
        <Text mt="4">{t('#BomPraTodos #JuntosDá')}</Text>
      </Box>
    </Box>
  );
};
