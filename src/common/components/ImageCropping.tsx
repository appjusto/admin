import { Box } from '@chakra-ui/react';
import React from 'react';
import Cropper from 'react-easy-crop';

interface CroppingProps {
  image: string;
}

export const ImageCropping = ({ image }: CroppingProps) => {
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const onCropComplete = React.useCallback((croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels);
  }, []);
  return (
    <Box>
      <Box>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={7 / 5}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </Box>
    </Box>
  );
};
