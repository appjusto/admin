import { BoxProps, Center, Flex } from '@chakra-ui/react';
import { ReactComponent as DropImage } from 'common/img/drop-image.svg';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageCropping } from './ImageCropping';
interface Props extends BoxProps {
  preview?: string | null;
  onDropFile: (acceptedFiles: File[]) => Promise<void>;
}

export const FileDropzone = ({
  width = 608,
  height = 434,
  onDropFile,
  preview,
  ...props
}: Props) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropFile,
    multiple: true,
    accept: 'image/jpeg, image/png',
  });
  return (
    <>
      <Flex
        position="relative"
        bg={!isDragActive ? 'gray.50' : 'gray.300'}
        borderWidth="1px"
        borderColor="gray.500"
        borderRadius="lg"
        cursor="pointer"
        width={width}
        height={height}
        {...props}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Center w="100%">
          {!preview && <DropImage />}
          {preview && <ImageCropping image={preview} />}
        </Center>
      </Flex>
    </>
  );
};

//{preview && <Image width={width} height={height} objectFit="contain" src={preview} />}
