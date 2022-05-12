import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Box, Circle, Flex, HStack, Link, Text } from '@chakra-ui/react';
import { CustomButton } from 'common/components/buttons/CustomButton';
import React from 'react';

interface NewRegistrationItemProps {
  label: string;
  btnLabel: string;
  btnLink: string;
  helpText: string;
  helpLink: string;
}

export const NewRegistrationItem = ({
  label,
  btnLabel,
  btnLink,
  helpText,
  helpLink,
}: NewRegistrationItemProps) => {
  // UI
  return (
    <Flex
      mt="6"
      p="6"
      w="100%"
      justifyContent="space-between"
      alignItems="center"
      bgColor="#F6F6F6"
      borderRadius="lg"
    >
      <HStack spacing={4}>
        <Circle size="24px" bgColor="#FFE493" color="black">
          1
        </Circle>
        <Box>
          <Text fontSize="16px" lineHeight="22px" fontWeight="700">
            {label}
          </Text>
          <HStack spacing={2}>
            <InfoOutlineIcon w="16px" h="16px" />
            <Link
              href={helpLink}
              isExternal
              fontSize="15px"
              lineHeight="21px"
              textDecor="underline"
            >
              {helpText}
            </Link>
          </HStack>
        </Box>
      </HStack>
      <CustomButton mt="0" label={btnLabel} link={btnLink} />
    </Flex>
  );
};
