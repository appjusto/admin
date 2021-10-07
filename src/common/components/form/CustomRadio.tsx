import { Center, Radio, RadioProps } from '@chakra-ui/react';

const CustomRadio = (props: RadioProps) => {
  return (
    <Center
      mt="1"
      border="2px solid black"
      position="relative"
      w="24px"
      h="24px"
      borderRadius="12px"
      boxShadow="none"
      overflow="hidden"
      _before={{ border: 'none' }}
      _after={{ border: 'none' }}
    >
      <Radio
        cursor="pointer"
        size="lg"
        boxShadow="none"
        bgColor="white"
        _checked={{ bgColor: 'green.500', outline: 'none' }}
        {...props}
      />
    </Center>
  );
};

export default CustomRadio;
