import { BoxProps, Center, Flex, Image, Text } from '@chakra-ui/react';
import { ReactComponent as DropImage } from 'common/img/drop-image.svg';
import { useDropzone } from 'react-dropzone';
import { ImageFbLoading } from '../ImageFbLoading';
interface Props extends BoxProps {
  preview?: string | null;
  placeholderText?: string;
  onDropFile: (acceptedFiles: File[]) => Promise<void>;
}

export const FileDropzone = ({
  width = 464,
  height = 261,
  onDropFile,
  preview,
  placeholderText,
  ...props
}: Props) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropFile,
    multiple: true,
    accept: 'image/jpeg, image/png',
  });
  return (
    <Flex
      position="relative"
      bg={!isDragActive ? 'gray.50' : 'gray.300'}
      borderWidth="1px"
      borderColor="gray.500"
      borderRadius="lg"
      cursor="pointer"
      width={width}
      height={height}
      overflow="hidden"
      {...props}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Center w="100%" height="100%">
        {preview ? (
          <Image
            src={preview}
            fallback={<ImageFbLoading width={width} height={height} />}
            width={width}
            height={height}
          />
        ) : (
          <Flex flexDir="column" alignItems="center">
            <DropImage />
            {placeholderText && (
              <Text
                mt="2"
                mb="-8"
                fontSize="16px"
                lineHeight="22px"
                maxW="138px"
                textAlign="center"
              >
                {placeholderText}
              </Text>
            )}
          </Flex>
        )}
      </Center>
    </Flex>
  );
};
