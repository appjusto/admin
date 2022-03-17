import { Badge, Box, Center, HStack, Icon, Stack, Text } from '@chakra-ui/react';
import { CustomButton } from 'common/components/buttons/CustomButton';
import React from 'react';
import { t } from 'utils/i18n';

interface NewFeatureBoxProps {
  icon: any;
  iconSize?: 'sm' | 'lg';
  title: string;
  description: string;
  link: string;
  btnLabel: string;
  btnVariant?: string;
  isExternal?: boolean;
  isNew?: boolean;
}

export const NewFeatureBox = ({
  icon,
  iconSize = 'sm',
  title,
  description,
  link,
  btnLabel,
  btnVariant,
  isExternal = false,
  isNew = true,
}: NewFeatureBoxProps) => {
  // helpers
  const iconDimentions = {
    box: iconSize === 'sm' ? '48px' : '64px',
    icon: iconSize === 'sm' ? '24px' : '36px',
  };
  // UI
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
      <Stack w="100%" direction={{ base: 'column', md: 'row' }} spacing={4} alignItems="center">
        <Center
          w={iconDimentions.box}
          h={iconDimentions.box}
          bgColor="#fff"
          borderRadius="24px"
          overflow="hidden"
        >
          <Icon as={icon} w={iconDimentions.icon} h={iconDimentions.icon} />
        </Center>
        <Box maxW="612px">
          <HStack spacing={4}>
            <Text mt="1" color="black" fontSize="18px" lineHeight="26px" fontWeight="700">
              {title}
            </Text>
            {isNew && (
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
            )}
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
      </Stack>
      <CustomButton
        minW="220px"
        fontSize="15px"
        fontWeight="700"
        label={btnLabel}
        link={link}
        variant={btnVariant ?? 'black'}
        isExternal={isExternal}
      />
    </Stack>
  );
};
