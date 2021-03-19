import { Flex, FlexProps } from '@chakra-ui/react';

export const Content = (props: FlexProps) => {
  return (
    <Flex
      w="100%"
      flexDir="column"
      alignItems="flex-start"
      position="relative"
      maxW={{ md: '312px', lg: '480px', xl: '656px' }}
      zIndex="999"
      {...props}
    >
      {props.children}
    </Flex>
  );
};
