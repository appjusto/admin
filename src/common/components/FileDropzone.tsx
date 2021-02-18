import { Box, BoxProps, Center, Flex } from '@chakra-ui/react';
import { ReactComponent as DropImage } from 'common/img/drop-image.svg';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageCropping } from './ImageCropping';
interface Props extends BoxProps {
  preview?: string | null;
  ratios?: number[];
  onDropFile: (acceptedFiles: File[]) => Promise<void>;
}

export const FileDropzone = ({
  width = 464,
  height = 261,
  onDropFile,
  preview,
  ratios = [1 / 1],
  ...props
}: Props) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropFile,
    multiple: true,
    accept: 'image/jpeg, image/png',
  });
  const boxHeight = (height as number) * 2 + 4;
  return (
    <>
      <Flex
        display={preview ? 'none' : 'block'}
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
        <Center w="100%" height="100%">
          {!preview && <DropImage />}
        </Center>
      </Flex>
      {preview &&
        ratios.map((ratio) => (
          <Box position="relative" width={width} height={height}>
            <ImageCropping mt={4} image={preview} ratio={ratio} />
          </Box>
        ))}
    </>
  );
};

//{preview && <Image width={width} height={height} objectFit="contain" src={preview} />}
