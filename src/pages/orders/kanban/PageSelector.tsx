import { Circle, Flex, Text } from '@chakra-ui/react';

interface FilterProps {
  isActive: boolean;
  label: string;
  onClick(): void;
  orders: number;
}

export const PageSelector = ({ isActive, label, onClick, orders, ...props }: FilterProps) => {
  return (
    <Flex
      py="2"
      px="4"
      flexDir="row"
      alignItems="center"
      fontSize="16px"
      lineHeight="24px"
      fontWeight="500"
      _hover={{ textDecor: 'none' }}
      _focus={{ boxShadow: 'none' }}
      bgColor={isActive ? 'white' : '#EEEEEE'}
      borderBottom={isActive ? '4px solid #78E08F' : 'none'}
      borderTopRadius="lg"
      cursor="pointer"
      onClick={onClick}
      aria-label={`nav-${label}`}
      {...props}
    >
      <Text>{label}</Text>
      <Flex ml="2" alignItems="center">
        <Circle size={['30px']} bg="white">
          <Text fontSize="14px" color="black">
            {orders}
          </Text>
        </Circle>
      </Flex>
    </Flex>
  );
};