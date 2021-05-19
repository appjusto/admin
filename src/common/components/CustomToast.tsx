import { InfoIcon } from '@chakra-ui/icons';
import { Box, HStack, Text } from '@chakra-ui/react';

interface CustomToastProps {
  type: 'success' | 'warning' | 'error';
  title: string;
  description?: string;
}

export const CustomToast = ({ type, title, description }: CustomToastProps) => {
  let bg = '#48BB78';
  if (type === 'warning') bg = '#ED8936';
  if (type === 'error') bg = '#E53E3E';
  return (
    <Box color="white" p="4" bg={bg} borderRadius="lg">
      <HStack spacing={4}>
        <InfoIcon />
        <Box>
          <Text>{title}</Text>
          {description && <Text>{description}</Text>}
        </Box>
      </HStack>
    </Box>
  );
};
