import { Circle, Flex, Text } from '@chakra-ui/react';

interface FilterProps {
  isActive: boolean;
  label: string;
  onClick(): void;
  orders: number;
}

export const PageSelector = ({ isActive, label, onClick, orders, ...props }: FilterProps) => {
  const isFirst = label.includes('Hoje');
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
      bgColor={isActive ? 'white' : '#EEEEEE4F'}
      border="1px solid #EEEEEE"
      borderBottom={isActive ? '4px solid #78E08F' : 'none'}
      borderTopLeftRadius={isFirst ? 'lg' : '0' }
      borderTopRightRadius={!isFirst ? 'lg' : '0' }
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