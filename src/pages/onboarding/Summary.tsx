import { Box, Center, Flex, Text } from '@chakra-ui/react';
import { t } from 'utils/i18n';
import { useContextSumarry } from './context/summary';

export const Summary = () => {
  // context
  const { commission, insurance, total } = useContextSumarry();
  // UI
  return (
    <Box
      mt="8"
      p="6"
      bgColor="white"
      border="1px solid"
      borderColor="gray.500"
      borderRadius="lg"
    >
      <Text fontWeight="700">{t('Resumo')}</Text>
      <Flex mt="4" justifyContent="space-between" alignItems="center">
        <Box maxW="90px" textAlign="center">
          <Text fontSize="18px" fontWeight="700">{`${commission}%`}</Text>
          <Text fontSize="14px">{t('Comissão AppJusto')}</Text>
        </Box>
        <Box maxW="90px" textAlign="center">
          <Text fontSize="18px" fontWeight="700">{`${insurance}%`}</Text>
          <Text fontSize="14px">{t('Taxa de cobertura')}</Text>
        </Box>
        <Box maxW="90px" textAlign="center">
          <Center
            w="90px"
            h="90px"
            bgColor="green.500"
            borderRadius="45px"
            fontWeight="700"
          >
            <Box>
              <Text fontSize="18px">{`${total}%`}</Text>
              <Text fontSize="14px">{t('Taxa total')}</Text>
            </Box>
          </Center>
        </Box>
      </Flex>
      <Box mt="4" fontSize="14px">
        <Text fontSize="16px" fontWeight="700" mb="2">
          {t('Taxas variáveis')}
        </Text>
        <Text>
          {t('Taxa PIX: ')}
          <Text as="span" fontWeight="700">
            0,99%
          </Text>
        </Text>
        <Text>{t('Taxa cartão de crédito (gateaway)')}</Text>
        <Text fontWeight="700">
          {t('Até 2,42% + R$ 0,09 - A menor do mercado!')}
        </Text>
      </Box>
    </Box>
  );
};
