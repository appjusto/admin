import { Center, Checkbox, CheckboxProps, Flex, HStack } from '@chakra-ui/react';

const CustomCheckbox = ({ children, w, h, mt, mb, isDisabled, ...props }: CheckboxProps) => {
  const containerProps = { w, h, mt, mb };
  return (
    <HStack {...containerProps}>
      <Center
        border="2px solid"
        borderColor={isDisabled ? 'gray.200' : 'black'}
        position="relative"
        w="24px"
        minW="24px"
        h="24px"
        borderRadius="4px"
        boxShadow="none"
        overflow="hidden"
        _before={{ border: 'none' }}
        _after={{ border: 'none' }}
      >
        <Checkbox
          size="md"
          iconColor="green.500"
          border="none"
          _focus={{ outline: 'none' }}
          _checked={{ bgColor: 'green.500', outline: 'none' }}
          isDisabled={isDisabled}
          {...props}
        />
      </Center>
      <Flex h="100%" alignItems="center">
        {children}
      </Flex>
    </HStack>
  );
};

export default CustomCheckbox;
