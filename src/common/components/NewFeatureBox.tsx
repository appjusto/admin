import {
  Badge,
  Box,
  Center,
  HStack,
  Icon,
  Stack,
  Text,
} from '@chakra-ui/react';
import { CustomButton } from 'common/components/buttons/CustomButton';
import React from 'react';
import { t } from 'utils/i18n';

interface NewFeatureBoxProps {
  mt?: string;
  icon?: any;
  iconSize?: 'sm' | 'lg';
  title: string;
  description: string | React.ReactNode;
  button?: {
    link: string;
    label: string;
  };
  btnVariant?: string;
  isExternal?: boolean;
  isNew?: boolean;
}

export const NewFeatureBox = ({
  mt = '8',
  icon,
  iconSize = 'sm',
  title,
  description,
  button,
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
      mt={mt}
      p="6"
      w="100%"
      direction={{ base: 'column', md: 'row' }}
      alignItems="center"
      border="1px solid black"
      borderRadius="lg"
      bgColor="#F6F6F6"
      spacing={4}
    >
      <Stack
        w="100%"
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        alignItems="center"
      >
        {icon && (
          <Center
            w={iconDimentions.box}
            h={iconDimentions.box}
            bgColor="#fff"
            borderRadius="24px"
            overflow="hidden"
          >
            <Icon as={icon} w={iconDimentions.icon} h={iconDimentions.icon} />
          </Center>
        )}
        <Box maxW={button ? '612px' : 'unset'}>
          <HStack spacing={4}>
            <Text
              // mt="1"
              color="black"
              fontSize="18px"
              lineHeight="normal"
              fontWeight="700"
            >
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
          {typeof description === 'string' ? (
            <Text mt="2" color="black" minW="140px">
              {description}
            </Text>
          ) : (
            description
          )}
        </Box>
      </Stack>
      {button && (
        <CustomButton
          minW="220px"
          fontSize="15px"
          fontWeight="700"
          label={button.label}
          link={button.link}
          variant={btnVariant ?? 'black'}
          isExternal={isExternal}
        />
      )}
    </Stack>
  );
};
