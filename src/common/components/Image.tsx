import { Box, Image as ChakraImg, ImageProps } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import VisibilitySensor from 'react-visibility-sensor';

interface ImgProps extends ImageProps {
  src: string;
  srcMob?: string;
}

const Image: React.FC<ImgProps> = ({ src, srcMob, ...props }) => {
  const [load, setLoad] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [width, setWidth] = useState(0);
  const updateWidth = useCallback(() => {
    if (typeof window !== 'undefined') {
      let width =
        window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      setWidth((prevWidth) => {
        if (srcMob && prevWidth !== width) {
          return width;
        } else if (prevWidth === 0) {
          return width;
        } else {
          return prevWidth;
        }
      });
    }
  }, [srcMob]);
  useEffect(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [updateWidth]);
  const handleVisibility = (value: boolean) => {
    if (value) {
      setIsActive(false);
      setLoad(true);
    }
  };
  return (
    <VisibilitySensor partialVisibility={true} active={isActive} onChange={handleVisibility}>
      <Box minW="1px" minH="1px">
        {width > 0 && load && (
          <ChakraImg src={srcMob ? (width < 1000 ? srcMob : src) : src} ignoreFallback {...props} />
        )}
      </Box>
    </VisibilitySensor>
  );
};

export default Image;
