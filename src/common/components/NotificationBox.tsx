import { Box, Center, HStack, Image, Stack, Text } from '@chakra-ui/react';
import party from 'common/img/emoji-party.png';
import React from 'react';
import { t } from 'utils/i18n';

export const NotificationBox = () => {
  return (
    <Stack
      mt="8"
      p="6"
      w="100%"
      direction={{ base: 'column', md: 'row' }}
      alignItems="center"
      border="1px solid #C8D7CB"
      borderRadius="lg"
      bgColor="#F6F6F6"
      spacing={4}
    >
      <Stack w="100%" direction={{ base: 'column', md: 'row' }} spacing={4} alignItems="center">
        <Center w="96px" h="96px" bgColor="#fff" borderRadius="48px" overflow="hidden">
          <Image src={party} w="42px" h="42px" />
        </Center>
        <Box maxW="900px">
          <HStack spacing={4}>
            <Text mt="1" color="black" fontSize="18px" lineHeight="26px" fontWeight="700">
              {t('Boas festas e feliz ano novo!')}
            </Text>
          </HStack>
          <Text
            mt="2"
            color="black"
            minW="140px"
            fontSize="16px"
            lineHeight="22px"
            fontWeight="500"
          >
            {t('Durante o encerramento do ano, entre os dias ')}
            <Text as="strong">{t('24 e 25 de dezembro - 31 de dezembro e 01 de janeiro, ')}</Text>
            {t('o AppJusto ficará indisponível para realizar uma manutenção programada.')}
          </Text>
          <Text
            mt="2"
            color="black"
            minW="140px"
            fontSize="16px"
            lineHeight="22px"
            fontWeight="500"
          >
            {t(
              'Nos vemos em breve com mais novidades e um delivery cada vez mais justo para todos!'
            )}
          </Text>
        </Box>
      </Stack>
    </Stack>
  );
};
