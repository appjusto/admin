import { Box, BoxProps } from '@chakra-ui/react';
import React from 'react';
import Cropper from 'react-easy-crop';

interface CroppingProps extends BoxProps {
  image: string;
  ratio: number;
}

export const ImageCropping = ({ image, ratio, ...props }: CroppingProps) => {
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const onCropComplete = React.useCallback((croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels);
  }, []);
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
