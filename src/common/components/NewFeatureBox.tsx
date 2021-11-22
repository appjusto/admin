import { Badge, Box, Center, HStack, Icon, Stack, Text } from '@chakra-ui/react';
import { CustomButton } from 'common/components/buttons/CustomButton';
import React from 'react';
import { t } from 'utils/i18n';

interface NewFeatureBoxProps {
  icon: any;
  title: string;
  description: string;
  link: string;
  btnLabel: string;
}

export const NewFeatureBox = ({ icon, title, description, link, btnLabel }: NewFeatureBoxProps) => {
  return (
    <Stack
      mt="8"
      p="6"
      w="100%"
      direction={{ base: 'column', md: 'row' }}
      alignItems="center"
      border="1px solid black"
      borderRadius="lg"
      bgColor="#F6F6F6"
      spacing={4}
    >
      <HStack w="100%" spacing={4} alignItems="center">
        <Center w="48px" h="48px" bgColor="#fff" borderRadius="24px" overflow="hidden">
          <Icon as={icon} w="24px" h="24px" />
        </Center>
        <Box maxW="612px">
          <HStack spacing={4}>
            <Text mt="1" color="black" fontSize="18px" lineHeight="26px" fontWeight="700">
              {title}
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
            color="black"
            minW="140px"
            fontSize="16px"
            lineHeight="22px"
            fontWeight="500"
          >
            {description}
          </Text>
        </Box>
      </HStack>
      <CustomButton minW="220px" label={btnLabel} link={link} variant="black" />
    </Stack>
  );
};
