import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import React from 'react';
import { t } from 'utils/i18n';

export const Panel = () => {
  // context

  // state

  // side effects

  // UI
  return (
    <Flex
      mt="10"
      flexDir={{ base: 'column', md: 'row' }}
      justifyContent="space-between"
      border="1px solid #F6F6F6"
      borderRadius="lg"
      p="8"
      color="black"
    >
      <Box>
        <Text fontSize="2xl" fontWeight="700" lineHeight="28.8px">
          {t('Hoje, quarta-feira')}
        </Text>
        <Text mt="2" fontSize="sm" fontWeight="500" lineHeight="21px" color="green.600">
          {t('10 de janeiro de 2020')}
        </Text>
        <HStack mt="4" spacing={6}>
          <Box w="142px">
            <Text fontSize="sm" lineHeight="21px" color="gray.700">
              {t('Pedidos')}
            </Text>
            <Text mt="2" fontSize="2xl" lineHeight="28.8px">
              {t('000')}
            </Text>
          </Box>
          <Box w="142px">
            <Text fontSize="sm" lineHeight="21px" color="gray.700">
              {t('Ticket médio')}
            </Text>
            <Text mt="2" fontSize="2xl" lineHeight="28.8px">
              {'R$ 00,00'}
            </Text>
          </Box>
        </HStack>
        <HStack mt="4" spacing={6}>
          <Box w="142px">
            <Text fontSize="sm" lineHeight="21px" color="gray.700">
              {t('Entregadores ativos')}
            </Text>
            <Text mt="2" fontSize="2xl" lineHeight="28.8px">
              {t('000')}
            </Text>
          </Box>
          <Box w="142px">
            <Text fontSize="sm" lineHeight="21px" color="gray.700">
              {t('Restaurantes abertos')}
            </Text>
            <Text mt="2" fontSize="2xl" lineHeight="28.8px">
              {t('000')}
            </Text>
          </Box>
        </HStack>
        <HStack mt="4" spacing={6}>
          <Box w="142px">
            <Text fontSize="sm" lineHeight="21px" color="gray.700">
              {t('Clientes novos')}
            </Text>
            <Text mt="2" fontSize="2xl" lineHeight="28.8px">
              {t('000')}
            </Text>
          </Box>
          <Box w="142px">
            <Text fontSize="sm" lineHeight="21px" color="gray.700">
              {t('Chamados abertos')}
            </Text>
            <Text mt="2" fontSize="2xl" lineHeight="28.8px">
              {t('000')}
            </Text>
          </Box>
        </HStack>
      </Box>
    </Flex>
  );
};
