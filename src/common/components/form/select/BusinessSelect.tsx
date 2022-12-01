import { Box, Heading, HStack, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { MdArrowDropDown } from 'react-icons/md';

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
  // handlers
  const handleSelect = (value: string) => {
    console.log(value);
    setShowOptions(false);
  };
  // UI
  return (
    <Box>
      <HStack>
        <Box>
          <Heading as="h1" fontSize="md">
            {selected?.name}
          </Heading>
          <Text fontSize="sm">{selected?.address}</Text>
        </Box>
        <Icon
          as={MdArrowDropDown}
          w="24px"
          h="24px"
          onClick={() => setShowOptions(true)}
        />
      </HStack>
      {showOptions && (
        <Box>
          {options.map((option) => {
            return (
              <Box
                key={option.value}
                onClick={() => handleSelect(option.value)}
              >
                <Heading as="h3" fontSize="md">
                  {option.name}
                </Heading>
                <Text fontSize="sm">{option.address}</Text>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};
