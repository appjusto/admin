import { Flex, FlexProps } from '@chakra-ui/react';

export const Section = (props: FlexProps) => {
  return (
    <Flex as="section" w="100%" flexDir="column" alignItems="center" position="relative" {...props}>
      {props.children}
    </Flex>
  );
};
