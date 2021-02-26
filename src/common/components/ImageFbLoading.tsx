import { Flex, FlexProps, Spinner } from '@chakra-ui/react';

interface ImageFbProps extends FlexProps {
  spinnerSize?: string;
}

export const ImageFbLoading = ({ spinnerSize = 'sm', ...props }: ImageFbProps) => {
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
      <Spinner size={spinnerSize} />
    </Flex>
  );
};
