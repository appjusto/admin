import { Badge, Box, Center, Flex, HStack, Image, Stack, Text } from '@chakra-ui/react';
import { CustomButton } from 'common/components/buttons/CustomButton';
import iSupport from 'common/img/i-support.png';
import spark from 'common/img/icon-spark-yellow.svg';
import React from 'react';
import { t } from 'utils/i18n';

interface CrowdfundingCardProps {
  isExternal?: boolean;
}

export const CrowdfundingCard = ({ isExternal }: CrowdfundingCardProps) => {
  // UI
  if (isExternal)
    return (
      <Flex
        w="100%"
        p="6"
        bgColor="#2F422C"
        borderRadius="16px"
        direction="row"
        justifyContent="space-between"
      >
        <Box maxW="452px">
          <Box>
            <Image src={spark} w="48px" h="48px" />
          </Box>
          <Text
            mt="4"
            maxW="440px"
            fontSize="32px"
            lineHeight="38.4px"
            fontWeight="700"
            color="#FFBE00"
          >
            {t('Já pensou em ser dono do App? Agora você pode!')}
          </Text>
          <Text
            mt="4"
            color="white"
            minW="140px"
            maxW="590px"
            fontSize="18px"
            lineHeight="26px"
            fontWeight="500"
          >
            {t(
              'Participe do investimento coletivo a partir de R$100 e seja parte desse movimento por relações mais justas e transparentes no delivery'
            )}
          </Text>
          <CustomButton
            w={{ base: '100%', lg: '312px' }}
            fontSize="15px"
            lineHeight="21px"
            fontWeight="700"
            label={t('Saber como investir')}
            link="https://app.kria.vc/agents/users/offers/277?locale=pt-BR"
            isExternal
          />
        </Box>
        <Box display={{ base: 'none', lg: 'block' }}>
          <Image src={iSupport} w="124px" h="124px" />
        </Box>
      </Flex>
    );
  return (
    <Stack
      mt="8"
      p="6"
      w="100%"
      direction={{ base: 'column', md: 'row' }}
      alignItems="center"
      borderRadius="lg"
      bgColor="#2F422C"
      spacing={4}
    >
      <Stack
        w="100%"
        direction={{ base: 'column', md: 'row' }}
        spacing={{ base: 4, lg: 8 }}
        alignItems="center"
      >
        <Center w="80px" h="80px">
          <Image src={iSupport} w="100%" />
        </Center>
        <Box maxW="612px">
          <HStack spacing={4}>
            <Text mt="1" fontSize="18px" lineHeight="26px" fontWeight="700" color="#FFBE00">
              {t('Já pensou em ser dono do App? Agora você pode!')}
            </Text>
            <Badge
              px="8px"
              py="2px"
              bgColor="#FFBE00"
              color="black"
              borderRadius="16px"
              fontSize="11px"
              lineHeight="18px"
              fontWeight="700"
            >
              {t('NOVIDADE')}
            </Badge>
          </HStack>
          <Text
            mt="2"
            color="white"
            minW="140px"
            maxW="590px"
            fontSize="16px"
            lineHeight="22px"
            fontWeight="500"
          >
            {t(
              'Participe do investimento coletivo a partir de R$100 e seja parte desse movimento por relações mais justas e transparentes no delivery'
            )}
          </Text>
        </Box>
      </Stack>
      <CustomButton
        minW="220px"
        fontSize="15px"
        lineHeight="21px"
        fontWeight="700"
        label={t('Saber como investir')}
        link="https://app.kria.vc/agents/users/offers/277?locale=pt-BR"
        isExternal
      />
    </Stack>
  );
};
