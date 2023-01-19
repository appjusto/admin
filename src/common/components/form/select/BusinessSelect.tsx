import { Box, Heading, HStack, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { MdArrowDropDown } from 'react-icons/md';
import { t } from 'utils/i18n';

export type BusinessSelectOptions = {
  value: string;
  name: string;
  address: string;
};

interface BusinessSelectProps {
  options: BusinessSelectOptions[];
  selected?: BusinessSelectOptions;
  onChange(selected: BusinessSelectOptions): void;
}

export const BusinessSelect = ({
  options,
  selected,
  onChange,
}: BusinessSelectProps) => {
  // state
  const [showOptions, setShowOptions] = React.useState(false);
  // refs
  const boxRef = React.useRef<HTMLDivElement>(null);
  // handlers
  const handleSelect = (option: BusinessSelectOptions) => {
    onChange(option);
  };
  React.useEffect(() => {
    if (!showOptions) return;
    const handleClick = () => {
      if (!showOptions) return;
      setShowOptions(false);
    };
    window.addEventListener('click', (event) => {
      try {
        const boxRectsData = boxRef.current?.getClientRects();
        const clientX = event.clientX;
        const clientY = event.clientY;
        if (!boxRectsData) return;
        const boxRects = boxRectsData[0];
        if (!boxRects) return;
        let insideX = false;
        let insideY = false;
        if (clientX > boxRects.left && clientX < boxRects.left + boxRects.width)
          insideX = true;
        if (clientY > boxRects.top && clientY < boxRects.top + boxRects.height)
          insideY = true;
        if (insideX && insideY) return;
        handleClick();
      } catch (error) {
        console.log(error);
      }
    });
    return () => window.removeEventListener('click', handleClick);
  }, [showOptions]);
  // UI
  return (
    <>
      <Box ref={boxRef} position="relative" w="fit-content">
        <HStack
          id="business-select-component"
          cursor="pointer"
          onClick={() => setShowOptions((prev) => !prev)}
        >
          <Box>
            <Heading as="h1" fontSize="md">
              {selected?.name}
            </Heading>
            <Text fontSize="sm">{selected?.address}</Text>
          </Box>
          <Box>
            <Icon as={MdArrowDropDown} w="28px" h="28px" />
          </Box>
        </HStack>
        {showOptions && (
          <Box
            position="absolute"
            top="0"
            bgColor="white"
            w="100%"
            minW="260px"
            borderLeft="1px solid #C8D7CB"
            borderBottom="1px solid #C8D7CB"
            borderRight="1px solid #C8D7CB"
            borderRadius="sm"
            boxShadow="0 1px 2px 0 rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)"
            zIndex="1300"
          >
            <Box px="2" py="1">
              <Text fontSize="xs" color="gray.600">
                {t('Selecionar unidade:')}
              </Text>
            </Box>
            <Box maxH="348px" overflowY="auto">
              {options.map((option) => {
                return (
                  <Box
                    key={option.value}
                    p="2"
                    cursor="pointer"
                    _hover={{ bg: '#F6F6F6' }}
                    color={
                      selected?.value === option.value
                        ? 'green.600'
                        : 'gray.800'
                    }
                    onClick={() => handleSelect(option)}
                  >
                    <Heading as="h3" fontSize="md">
                      {option.name}
                    </Heading>
                    <Text fontSize="sm">{option.address}</Text>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};
