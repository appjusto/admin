import { Box, BoxProps, Flex, Image, Tooltip } from '@chakra-ui/react';
import { CloseButton } from 'common/components/buttons/CloseButton';
import { CroppedAreaProps } from 'common/components/ImageCropping';
import React from 'react';
import { getCroppedImg } from 'utils/functions';
import { t } from 'utils/i18n';
import { FileDropzone } from './FileDropzone';
import { ImageCropping } from './ImageCropping';

interface Props extends BoxProps {
  preview?: string | null;
  ratios: number[];
  resizedWidth: number[];
  hasImage: boolean;
  onDropFile: (acceptedFiles: File[]) => Promise<void>;
  onCropEnd?(files: File[]): void;
  clearDrop?(): void;
}

export const ImageUploads = ({
  width = 464,
  height = 261,
  onDropFile,
  preview,
  ratios,
  resizedWidth,
  hasImage = false,
  onCropEnd = () => {},
  clearDrop = () => {},
  ...props
}: Props) => {
  const [state, setState] = React.useState<CroppedAreaProps[]>([]);
  const handleCrop = (index: number, croppedArea: CroppedAreaProps) => {
    setState((prevState) => {
      const newAreas = [...prevState];
      newAreas[index] = croppedArea;
      return newAreas;
    });
  };

  React.useEffect(() => {
    if (state.length > 0 && preview) {
      const getImageFiles = async (areas: CroppedAreaProps[]) => {
        let files = [] as File[];
        areas.forEach(async (area, index: number) => {
          const file = await getCroppedImg(
            preview as string,
            area,
            ratios[index],
            resizedWidth[index]
          );
          files.push(file as File);
        });
        return onCropEnd(files);
      };
      getImageFiles(state);
    }
  }, [state, preview]);

  if (hasImage && preview) {
    return (
      <Flex flexDir="column" alignItems="flex-end" maxW={width}>
        <Tooltip label={t('Escolher outra imagem')}>
          <CloseButton mb={2} size="xs" onClick={clearDrop} />
        </Tooltip>
        <Image src={preview} width={width} height={(width as number) / ratios[0]} />
      </Flex>
    );
  }

  if (preview) {
    return (
      <>
        <Flex flexDir="column" alignItems="flex-end" maxW={width} {...props}>
          <Tooltip label={t('Escolher outra imagem')}>
            <CloseButton mb={2} size="xs" onClick={clearDrop} />
          </Tooltip>
        </Flex>
        {ratios.map((ratio, index) => (
          <Box key={ratio} position="relative" width={width} height={height}>
            <ImageCropping
              mt={4}
              index={index}
              image={preview}
              ratio={ratio}
              onCropEnd={handleCrop}
            />
          </Box>
        ))}
      </>
    );
  }
  return (
    <FileDropzone
      onDropFile={onDropFile}
      preview={preview}
      width={width}
      height={height}
      {...props}
    />
  );
};
