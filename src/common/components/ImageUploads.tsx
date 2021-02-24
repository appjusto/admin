import { Box, BoxProps, Flex, Tooltip } from '@chakra-ui/react';
import { CloseButton } from 'common/components/buttons/CloseButton';
import { CroppedAreaProps } from 'common/components/ImageCropping';
import React from 'react';
import { getCroppedImg } from 'utils/functions';
import { t } from 'utils/i18n';
import { AlertError } from './AlertError';
import { FileDropzone } from './FileDropzone';
import { ImageCropping } from './ImageCropping';

interface Props extends BoxProps {
  width?: number | string | undefined;
  height?: number | string | undefined;
  imageUrl?: string | null;
  ratios: number[];
  resizedWidth: number[];
  getImages(files: File[]): void;
  clearDrop(): void;
}

const initError = { status: false, message: { title: '', description: '' } };

export const ImageUploads = React.memo(
  ({
    width = 464,
    height = 261,
    imageUrl,
    ratios,
    resizedWidth,
    getImages,
    clearDrop,
    ...props
  }: Props) => {
    // state
    const [croppedAreas, setCroppedAreas] = React.useState<CroppedAreaProps[]>([]);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const [error, setError] = React.useState(initError);
    const imageExists = React.useRef(false);
    // handlers
    const handleCrop = React.useCallback((index: number, croppedArea: CroppedAreaProps) => {
      setCroppedAreas((prevState) => {
        const newAreas = [...prevState];
        newAreas[index] = croppedArea;
        return newAreas;
      });
    }, []);

    const onDropHandler = React.useCallback(
      async (acceptedFiles: File[]) => {
        const [file] = acceptedFiles;
        if (!file)
          return setError({
            status: true,
            message: {
              title: 'Formato de arquivo inválido.',
              description: 'As imagens devem estar nos formatos jpeg ou png.',
            },
          });
        if (error.status) setError(initError);
        const url = URL.createObjectURL(file);
        imageExists.current = false;
        setPreviewUrl(url);
      },
      [error.status]
    );

    const clearDroppedImages = () => {
      imageExists.current = false;
      setPreviewUrl(null);
      clearDrop();
    };
    React.useEffect(() => {
      if (imageUrl) {
        imageExists.current = true;
        setPreviewUrl(imageUrl);
      }
    }, [imageUrl]);

    React.useEffect(() => {
      if (croppedAreas.length > 0 && previewUrl) {
        const getImageFiles = async (areas: CroppedAreaProps[]) => {
          let files = [] as File[];
          areas.forEach(async (area, index: number) => {
            const file = await getCroppedImg(
              previewUrl as string,
              area,
              ratios[index],
              resizedWidth[index]
            );
            files.push(file as File);
          });
          return getImages(files);
        };
        getImageFiles(croppedAreas);
      }
    }, [croppedAreas, previewUrl, getImages, ratios, resizedWidth]);

    if (imageExists.current && previewUrl) {
      return (
        <>
          <FileDropzone
            onDropFile={onDropHandler}
            preview={previewUrl}
            width={parseInt(width as string)}
            height={parseInt(width as string) / ratios[0]}
            {...props}
          />
          {error.status && (
            <AlertError
              title={error.message.title}
              description={error.message.description}
              maxW={width}
            />
          )}
        </>
      );
    }

    if (previewUrl) {
      return (
        <>
          <Flex flexDir="column" alignItems="flex-end" maxW={width} {...props}>
            <Tooltip label={t('Escolher outra imagem')}>
              <CloseButton mb={2} size="xs" onClick={clearDroppedImages} />
            </Tooltip>
          </Flex>
          {ratios.map((ratio, index) => (
            <Box key={ratio} position="relative" width={width} height={height}>
              <ImageCropping
                mt={4}
                index={index}
                image={previewUrl}
                ratio={ratio}
                onCropEnd={handleCrop}
              />
            </Box>
          ))}
        </>
      );
    }
    return (
      <>
        <FileDropzone
          onDropFile={onDropHandler}
          preview={previewUrl}
          width={width}
          height={height}
          {...props}
        />
        {error.status && (
          <AlertError
            title={error.message.title}
            description={error.message.description}
            maxW={width}
          />
        )}
      </>
    );
  }
);
