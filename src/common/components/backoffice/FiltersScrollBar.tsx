import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Center, CenterProps, HStack } from '@chakra-ui/react';
import React from 'react';
import { FilterText } from './FilterText';

const IconWrapper = ({ children, ...props }: CenterProps) => {
  return (
    <Center
      position="absolute"
      bgColor="white"
      top="0"
      h="100%"
      px="2"
      pb="1"
      borderRadius="lg"
      _hover={{ bgColor: 'gray.100' }}
      zIndex="100"
      cursor="pointer"
      {...props}
    >
      {children}
    </Center>
  );
};

interface FiltersScrollBarProps {
  filters?: { label: string; value: string }[];
  currentValue?: string;
  selectFilter?(value: string): void;
  spacing?: number;
  children?: React.ReactNode;
}

export const FiltersScrollBar = ({
  filters,
  currentValue,
  selectFilter,
  spacing = 4,
  children,
}: FiltersScrollBarProps) => {
  // state
  const [filtersScroll, setFiltersScroll] = React.useState(0);
  const [scrollArea, setScrollArea] = React.useState<number>();
  const [scrollRightActive, setScrollRightActive] = React.useState(true);
  // refs
  const childrenWrapperRef = React.useRef<HTMLDivElement>(null);
  // handlers
  const handleFiltersScroll = (direction: 'left' | 'right') => {
    if (direction === 'left' && filtersScroll < 0)
      setFiltersScroll((prev) => prev + 100);
    else if (direction === 'right' && scrollRightActive)
      setFiltersScroll((prev) => prev - 100);
  };
  React.useEffect(() => {
    if (!childrenWrapperRef.current) return;
    const clientW = childrenWrapperRef.current.clientWidth;
    const scrollWidth = childrenWrapperRef.current.scrollWidth;
    if (clientW < scrollWidth) {
      const diff = scrollWidth - clientW;
      setScrollArea(diff);
    } else {
      setScrollRightActive(false);
    }
  }, [childrenWrapperRef]);
  React.useEffect(() => {
    if (filtersScroll === undefined || scrollArea === undefined) return;
    if (scrollArea + filtersScroll < 0) setScrollRightActive(false);
    else setScrollRightActive(true);
  }, [filtersScroll, scrollArea]);
  //console.log('scrollRightActive', scrollRightActive);
  // UI
  return (
    <Box
      position="relative"
      overflowX={{ base: 'scroll', lg: 'hidden' }}
      w="100%"
    >
      <IconWrapper
        left="0"
        display={{ base: 'none', lg: `${filtersScroll < 0 ? 'flex' : 'none'}` }}
        onClick={() => handleFiltersScroll('left')}
      >
        <ChevronLeftIcon fontSize="18px" />
      </IconWrapper>
      <Box
        ref={childrenWrapperRef}
        ml={`${filtersScroll}px`}
        transition="margin 0.4s"
      >
        {filters && selectFilter && (
          <HStack spacing={spacing}>
            {filters.map((filter) => (
              <FilterText
                isActive={currentValue === filter.value}
                label={filter.label}
                onClick={() => selectFilter(filter.value)}
              />
            ))}
          </HStack>
        )}
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
