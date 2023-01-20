import { Box, Flex, HStack, Text } from '@chakra-ui/react';

export type InsuranceFeeInfo = { value: string; label: string };

interface FeesBoxProps {
  fees: InsuranceFeeInfo[];
  children?: React.ReactNode;
}

export const FeesBox = ({ fees, children }: FeesBoxProps) => {
  return (
    <Box mt="4">
      <HStack
        p="4"
        w="fit-content"
        spacing={6}
        alignItems="flex-start"
        bgColor="#F5F5F5"
        borderRadius="lg"
      >
        {fees.map((fee, index) => {
          const isLast = index === fees.length - 1;
          return (
            <Box
              key={fee.label}
              maxW="90px"
              textAlign="center"
              fontWeight={isLast ? '700' : '500'}
            >
              <Flex justifyContent="center" alignItems="flex-end">
                <Text fontSize="20px">{fee.value}</Text>
              </Flex>
              <Text fontSize="12px" maxW={isLast ? '90px' : '60px'}>
                {fee.label}
              </Text>
            </Box>
          );
        })}
      </HStack>
      <Box>{children}</Box>
    </Box>
  );
};