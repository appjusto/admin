import { Box, Center, Flex, Text } from '@chakra-ui/react';

interface FeeDescriptionItemProps {
  title: string;
  description: string;
  fee: number;
  highlight?: boolean;
}

export const FeeDescriptionItem = ({
  title,
  description,
  fee,
  highlight,
}: FeeDescriptionItemProps) => {
  return (
    <Flex mt="6">
      <Box minW="48px">
        <Center
          w="46px"
          h="46px"
          bgColor={highlight ? 'green.500' : 'gray.500'}
          borderRadius="23px"
          fontWeight="700"
        >
          {`${fee}%`}
        </Center>
      </Box>
      <Box ml="4">
        <Text fontSize="16px" fontWeight="700">
          {title}
        </Text>
        <Text fontSize="16px">{description}</Text>
      </Box>
    </Flex>
  );
};
