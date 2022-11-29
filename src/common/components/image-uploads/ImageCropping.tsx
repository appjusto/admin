import { Search2Icon } from '@chakra-ui/icons';
import {
  Box,
  BoxProps,
  HStack,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from '@chakra-ui/react';
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
  width?: number | string | undefined;
  height?: number | string | undefined;
  onCropEnd(index: number, croppedArea: CroppedAreaProps): void;
}

export const ImageCropping = ({
  index,
  image,
  ratio,
  width,
  height,
  onCropEnd,
  ...props
}: CroppingProps) => {
  // state
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  // handlers
  const onCropComplete = React.useCallback(
    (croppedArea, croppedAreaPixels) => {
      onCropEnd(index, croppedAreaPixels);
    },
    [index, onCropEnd]
  );
  // UI
  return (
    <Box w="100%" mb="6" {...props}>
      <Box
        position="relative"
        width={width}
        height={height}
        backgroundColor="#ffff"
        border="1px solid #9AA49C"
        borderRadius="lg"
        overflow="hidden"
      >
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={ratio}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          minZoom={0}
          restrictPosition={false}
        />
      </Box>
      <HStack mt="4" spacing={4} width={width} alignItems="center">
        <Text fontSize="15px" fontWeight="700">
          Zoom
        </Text>
        <Slider
          mb="-1"
          aria-label="slider-zoom"
          value={zoom}
          min={0}
          max={3}
          step={0.1}
          onChange={(val) => setZoom(val)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb _focus={{ outline: 'none' }}>
            <Box as={Search2Icon} />
          </SliderThumb>
        </Slider>
      </HStack>
    </Box>
  );
};
