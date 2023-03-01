import { Box, Center, Flex, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { MdCheck } from 'react-icons/md';

interface LogisticsItemProps {
  title: string;
  children: React.ReactNode;
  icon?: boolean;
}

export const LogisticsItem = ({
  title,
  children,
  icon,
}: LogisticsItemProps) => {
  return (
    <Flex mt="6">
      <Box minW="40px">
        {icon && (
          <Center>
            <Icon as={MdCheck} color="green.600" w="24px" h="24px" />
          </Center>
        )}
      </Box>
      <Box ml="4">
        <Text fontSize="16px" fontWeight="700">
          {title}
        </Text>
        {children}
      </Box>
    </Flex>
  );
};
