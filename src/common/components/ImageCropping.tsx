import { Box, BoxProps } from '@chakra-ui/react';
import React from 'react';
import Cropper from 'react-easy-crop';

export interface CroppedAreaProps {
  height: number;
  width: number;
  x: number;
  y: number;
}

interface CroppingProps extends BoxProps {
  index: number;
  image: string;
  ratio: number;
  onCropEnd(index: number, croppedArea: CroppedAreaProps): void;
}

export const ImageCropping = ({ index, image, ratio, onCropEnd, ...props }: CroppingProps) => {
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const onCropComplete = React.useCallback(
    (croppedArea, croppedAreaPixels) => {
      onCropEnd(index, croppedAreaPixels);
    },
    [index, onCropEnd]
  );
  return (
    <Box {...props}>
      <Box>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={ratio}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </Box>
    </Box>
  );
};
