import { Box, BoxProps, Flex, Tooltip } from '@chakra-ui/react';
import imageCompression from 'browser-image-compression';
import { CloseButton } from 'common/components/buttons/CloseButton';
import { CroppedAreaProps } from 'common/components/image-uploads/ImageCropping';
import React from 'react';
import { getCroppedImg } from 'utils/functions';
import { t } from 'utils/i18n';
import { AlertError } from './AlertError';
import { FileDropzone } from './image-uploads/FileDropzone';
import { ImageCropping } from './image-uploads/ImageCropping';

export type ImageType = 'image/jpeg' | 'image/png';

interface Props extends BoxProps {
  width: number | string | undefined;
  height: number | string | undefined;
  imageUrl?: string | null;
  ratios: number[];
  resizedWidth: number[];
  placeholderText?: string;
  doubleSizeCropping?: boolean;
  imageType?: ImageType;
  getImages(files: File[]): void;
  clearDrop(): void;
}

const initError = { status: false, message: { title: '', description: '' } };

export const ImageUploads = React.memo(
  ({
    width,
    height,
    imageUrl,
    ratios,
    resizedWidth,
    placeholderText,
    doubleSizeCropping = false,
    imageType = 'image/jpeg',
    getImages,
    clearDrop,
    ...props
  }: Props) => {
    // state
    const [croppedAreas, setCroppedAreas] = React.useState<CroppedAreaProps[]>(
      []
    );
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    //const [imageType, setImageType] = React.useState<ImageType>('image/jpeg');
    const [error, setError] = React.useState(initError);
    // refs
    const imageExists = React.useRef(false);
    // helpers
    const w = (width ?? 200) as number;
    const doubleW = w * 2;
    const croppingW = doubleSizeCropping ? (doubleW <= 833 ? doubleW : 833) : w;
    const croppingH = croppingW / ratios[0];
    // handlers
    const handleCrop = React.useCallback(
      (index: number, croppedArea: CroppedAreaProps) => {
        setCroppedAreas((prevState) => {
          const newAreas = [...prevState];
          newAreas[index] = croppedArea;
          return newAreas;
        });
      },
      []
    );
    const onDropHandler = React.useCallback(
      async (acceptedFiles: File[]) => {
        const [file] = acceptedFiles;
        //if (file.type === 'image/png') setImageType('image/png');
        const options = {
          maxSizeMB: 2,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        if (!file)
          return setError({
            status: true,
            message: {
              title: 'Formato de arquivo inválido.',
              description: 'As imagens devem estar nos formatos jpeg ou png.',
            },
          });
        if (error.status) setError(initError);
        const compressedFile = await imageCompression(file, options);
        const url = URL.createObjectURL(compressedFile);
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
    // side effects
    React.useEffect(() => {
      if (imageUrl) {
        imageExists.current = true;
        setPreviewUrl(imageUrl);
        setCroppedAreas([]);
      } else {
        imageExists.current = false;
        setPreviewUrl(null);
      }
    }, [imageUrl]);
    React.useEffect(() => {
      if (croppedAreas.length > 0 && previewUrl) {
        const getImageFiles = async (areas: CroppedAreaProps[]) => {
          let files = [] as File[];
          areas.forEach(async (area, index: number) => {
            try {
              const file = await getCroppedImg(
                previewUrl as string,
                area,
                ratios[index],
                resizedWidth[index],
                imageType
              );
              files.push(file as File);
            } catch (error) {
              console.log('forEach Error', error);
              return null;
            }
          });
          return getImages(files);
        };
        getImageFiles(croppedAreas);
      }
    }, [croppedAreas, previewUrl, getImages, ratios, resizedWidth, imageType]);
    // UI
    if (imageExists.current && previewUrl) {
      return (
        <Box w="100%">
          <FileDropzone
            onDropFile={onDropHandler}
            preview={previewUrl}
            width={width}
            height={height}
            placeholderText={placeholderText}
            {...props}
          />
          {error.status && (
            <AlertError
              title={error.message.title}
              description={error.message.description}
              maxW={width}
            />
          )}
        </Box>
      );
    }
    if (previewUrl) {
      return (
        <Box w="100%">
          <Flex
            flexDir="column"
            alignItems="flex-end"
            maxW={width && (width as number) * 2}
            {...props}
          >
            <Tooltip label={t('Escolher outra imagem')}>
              <CloseButton mb={2} size="xs" onClick={clearDroppedImages} />
            </Tooltip>
          </Flex>
          <Box w="100%" position="relative">
            {ratios.map((ratio, index) => (
              <ImageCropping
                key={ratio}
                mt={4}
                index={index}
                image={previewUrl}
                ratio={ratio}
                width={croppingW}
                height={croppingH}
                onCropEnd={handleCrop}
                position={index > 0 ? 'absolute' : 'relative'}
                top={index > 0 ? '0' : undefined}
                left={index > 0 ? '0' : undefined}
                zIndex={index > 0 ? '100' : '999'}
                opacity={index > 0 ? '0' : '1'}
              />
            ))}
          </Box>
        </Box>
      );
    }
    return (
      <Box w="100%">
        <FileDropzone
          onDropFile={onDropHandler}
          preview={previewUrl}
          width={width}
          height={height}
          placeholderText={placeholderText}
          {...props}
        />
        {error.status && (
          <AlertError
            title={error.message.title}
            description={error.message.description}
            maxW={width}
          />
        )}
      </Box>
    );
  }
);
