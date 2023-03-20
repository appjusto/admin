import { Box, Center, Flex, Icon, Text } from '@chakra-ui/react';
import { MdCheck } from 'react-icons/md';

interface LogisticsItemProps {
  title: string;
  iconDisabled?: boolean;
  isDisabled?: boolean;
}

export const LogisticsItem = ({
  title,
  iconDisabled,
  isDisabled,
}: LogisticsItemProps) => {
  return (
    <Flex mt="6">
      <Box minW="24px">
        <Center>
          <Icon
            as={MdCheck}
            color={iconDisabled || isDisabled ? 'gray.500' : 'green.600'}
            w="24px"
            h="24px"
          />
        </Center>
      </Box>
      <Box ml="4">
        <Text
          fontSize="16px"
          fontWeight="500"
          color={isDisabled ? 'gray.500' : 'black'}
        >
          {title}
        </Text>
      </Box>
    </Flex>
  );
};
