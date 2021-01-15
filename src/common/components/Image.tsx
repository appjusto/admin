import { Box, Image as ChakraImg, ImageProps } from '@chakra-ui/react';
import useVisibilitySensor from '@rooks/use-visibility-sensor';
import { useCallback, useEffect, useRef, useState } from 'react';

interface ImgProps extends ImageProps {
  src: string;
  srcMob?: string;
  scrollCheck?: boolean;
  eagerLoading?: boolean;
}

const Image: React.FC<ImgProps> = ({
  src,
  srcMob,
  scrollCheck = true,
  eagerLoading = false,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [width, setWidth] = useState(0);
  const rootNode = useRef(null);
  const { isVisible } = useVisibilitySensor(rootNode, {
    partialVisibility: true,
    intervalCheck: false,
    scrollCheck: scrollCheck,
    resizeCheck: true,
  });
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
  useEffect(() => {
    if (isVisible && !loaded) {
      setLoaded(true);
    }
  }, [isVisible, loaded]);
  if (eagerLoading) {
    return (
      <Box ref={rootNode}>
        {width > 0 && (
          <ChakraImg src={srcMob ? (width < 1000 ? srcMob : src) : src} ignoreFallback {...props} />
        )}
      </Box>
    );
  }
  return (
    <Box ref={rootNode} minW="1px" minH="1px">
      {width > 0 && loaded && (
        <ChakraImg src={srcMob ? (width < 1000 ? srcMob : src) : src} ignoreFallback {...props} />
      )}
    </Box>
  );
};

export default Image;
