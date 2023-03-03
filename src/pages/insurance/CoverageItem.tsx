import { Box, HStack, Icon, Text } from '@chakra-ui/react';
import { MdCheck } from 'react-icons/md';

interface CoverageItemProps {
  isVisible: boolean;
  label: string;
}

export const CoverageItem = ({ isVisible, label }: CoverageItemProps) => {
  if (!isVisible) return <Box />;
  return (
    <HStack spacing={2} alignItems="flex-start">
      <Icon as={MdCheck} color="green.500" w="24px" h="24px" />
      <Text>{label}</Text>
    </HStack>
  );
};
