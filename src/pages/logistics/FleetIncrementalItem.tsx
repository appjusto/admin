import { Box, Center, Flex, HStack, IconButton, Text } from '@chakra-ui/react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { formatCurrency } from 'utils/formatters';

interface UnitBadgeProps {
  content: string;
}

const UnitBadge = ({ content }: UnitBadgeProps) => {
  return (
    <Center border="1px solid black" borderRadius="16px" px="2" minW="68px">
      <Text mb="0">{content}</Text>
    </Center>
  );
};

interface FleetIncrementalItemProps {
  title: string;
  description: string;
  value: number;
  onChange(value: number): void;
  incrementNumber: number;
  isCurrency?: boolean;
  showCents?: boolean;
  unit?: string;
  minimum?: number;
}

export const FleetIncrementalItem = ({
  title,
  description,
  value,
  onChange,
  incrementNumber,
  isCurrency,
  showCents,
  unit,
  minimum,
}: FleetIncrementalItemProps) => {
  // helpers
  const valueFormatted = isCurrency
    ? formatCurrency(value)
    : `${value / 1000} ${unit}`;
  let unitValue: string | number = isCurrency ? value / 100 : value / 1000;
  if (showCents) unitValue = unitValue.toFixed(2);
  // handlers
  const handleChange = (type: 'inc' | 'dec') => {
    const increment = incrementNumber * (type === 'inc' ? 1 : -1);
    const result = value + increment;
    const minimumValid = minimum ?? 0;
    if (result >= minimumValid) onChange(value + increment);
  };
  // UI
  return (
    <Box mt="6" mb="4">
      <Flex flexDir="row" justifyContent="space-between">
        <Text fontSize="xl" color="black">
          {title}
        </Text>
        <UnitBadge content={valueFormatted} />
      </Flex>
      <Text mt="3">{description}</Text>
      <HStack mt="4" spacing={4}>
        <IconButton
          variant="outline"
          aria-label={`Increment ${title}`}
          icon={<AiOutlineMinus />}
          onClick={() => handleChange('dec')}
        />
        <Center w="28px">
          <Text fontSize="xl">{unitValue}</Text>
        </Center>
        <IconButton
          variant="outline"
          aria-label={`Increment ${title}`}
          icon={<AiOutlinePlus />}
          onClick={() => handleChange('inc')}
        />
      </HStack>
    </Box>
  );
};
