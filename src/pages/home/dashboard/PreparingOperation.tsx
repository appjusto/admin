import { Box, Button, Flex, Icon, Link, Text } from '@chakra-ui/react';
import React from 'react';
import { IoMdTime } from 'react-icons/io';
import { t } from 'utils/i18n';
import { Operation1 } from './communication/Operation1';
import { Operation2 } from './communication/Operation2';
import { Operation3 } from './communication/Operation3';

export const PreparingOperation = () => {
  React.useEffect(() => {
    window?.scrollTo(0, 0);
  }, []);
  return (
    <Box mt="6">
      <Text fontSize="4xl" color="black">
        {t('Boas-vindas ao AppJusto')}
      </Text>
      <Text>
        {t(
          'Juntos, construindo uma plataforma de delivery mais justa e humana para todos!'
        )}
      </Text>
      <Flex
        mt="6"
        flexDir={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="flex-end"
      >
        <Box>
          <Text fontSize="2xl" color="black">
            {t('Vamos começar?')}
          </Text>
          <Text>
            {t(
              'Em 3 passos seu restaurante estará pronto para receber pedidos.'
            )}
          </Text>
        </Box>
        <Flex
          alignItems="center"
          border="1px solid #D7E7DA"
          borderRadius="lg"
          bgColor="gray.100"
          px="2"
          py="1"
          color="black"
        >
          <Icon as={IoMdTime} />
          <Text ml="2" fontSize="sm">
            {t('20 minutos')}
          </Text>
        </Flex>
      </Flex>
      <Operation1 />
      <Operation2 />
      <Operation3 />
      <Flex
        mt="6"
        bgColor="#C8D7CB"
        borderRadius="lg"
        px="4"
        py="6"
        flexDir={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Box maxW="640px">
          <Text fontSize="xl" fontWeight="semibold">
            {t('Conheça o portal do restaurante')}
          </Text>
          <Text>
            {t(
              'Dicas, treinamentos, melhores práticas, dúvidas, materiais: tudo o que você precisa saber, em um só lugar'
            )}
          </Text>
        </Box>
        <Link
          href="https/appjusto.com.br"
          w={{ base: '100%', md: 'auto' }}
          isExternal
        >
          <Button
            mt={{ base: '4', md: '0' }}
            size="md"
            fontSize="sm"
            variant="secondary"
            minW="112px"
            w={{ base: '100%', md: 'auto' }}
          >
            {t('Acessar')}
          </Button>
        </Link>
      </Flex>
    </Box>
  );
};
