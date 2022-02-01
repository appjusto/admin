import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, BoxProps, Center, CenterProps } from '@chakra-ui/react';
import React from 'react';

const IconWrapper = ({ children, ...props }: CenterProps) => {
  return (
    <Center
      position="absolute"
      bgColor="white"
      top="0"
      h="100%"
      px="2"
      borderRadius="lg"
      _hover={{ bgColor: 'gray.100' }}
      zIndex="9999"
      cursor="pointer"
      {...props}
    >
      {children}
    </Center>
  );
};

export const FiltersScrollBar = ({ children }: BoxProps) => {
  // state
  const [filtersScroll, setFiltersScroll] = React.useState(0);
  const [scrollArea, setScrollArea] = React.useState<number>();
  const [scrollRightActive, setScrollRightActive] = React.useState(true);
  // refs
  const childrenWrapperRef = React.useRef<HTMLDivElement>(null);
  // handlers
  const handleFiltersScroll = (direction: 'left' | 'right') => {
    if (direction === 'left' && filtersScroll < 0) setFiltersScroll((prev) => prev + 100);
    else if (direction === 'right' && scrollRightActive) setFiltersScroll((prev) => prev - 100);
  };
  React.useEffect(() => {
    if (!childrenWrapperRef.current) return;
    const clientW = childrenWrapperRef.current.clientWidth;
    const scrollWidth = childrenWrapperRef.current.scrollWidth;
    const diff = scrollWidth - clientW;
    setScrollArea(diff);
  }, [childrenWrapperRef]);
  React.useEffect(() => {
    if (!filtersScroll || !scrollArea) return;
    console.log('Calc', scrollArea + filtersScroll);
    if (scrollArea + filtersScroll < 0) setScrollRightActive(false);
    else setScrollRightActive(true);
  }, [filtersScroll, scrollArea]);
  // UI
  return (
    <Box position="relative" overflowX={{ base: 'scroll', lg: 'hidden' }} w="100%">
      <IconWrapper
        left="0"
        display={{ base: 'none', lg: `${filtersScroll < 0 ? 'flex' : 'none'}` }}
        onClick={() => handleFiltersScroll('left')}
      >
        <ChevronLeftIcon fontSize="18px" />
      </IconWrapper>
      <Box ref={childrenWrapperRef} ml={`${filtersScroll}px`} transition="margin 0.4s">
        {children}
      </Box>
      <IconWrapper
        right="0"
        display={{ base: 'none', lg: `${scrollRightActive ? 'flex' : 'none'}` }}
        onClick={() => handleFiltersScroll('right')}
      >
        <ChevronRightIcon fontSize="18px" />
      </IconWrapper>
    </Box>
  );
};
