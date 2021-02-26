import { Flex, FlexProps, Spinner } from '@chakra-ui/react';

export const ImageFbLoading = (props: FlexProps) => {
  return (
    <Flex
      bg="gray.50"
      borderWidth="1px"
      borderColor="gray.500"
      borderRadius="lg"
      justifyContent="center"
      alignItems="center"
      {...props}
    >
      <Spinner />
    </Flex>
  );
};
