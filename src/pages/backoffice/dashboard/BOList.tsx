import { Box, Circle, Flex, Text, VStack } from '@chakra-ui/react';
import { Business, Order, WithId } from 'appjusto-types';
import { ShowIf } from 'core/components/ShowIf';
import React from 'react';
import { BOBusinessListItem } from './BOBusinessListItem';
import { BOOrderListItem } from './BOOrderListItem';

type ListType = 'orders' | 'businesses';

interface Props {
  title: string;
  data: WithId<Business>[] | WithId<Order>[];
  listType: ListType;
  details?: string;
}

export const BOList = ({ title, data, listType, details }: Props) => {
  // UI
  return (
    <Flex
      w="100%"
      h={['600px']}
      borderRadius="lg"
      borderColor="gray.500"
      borderWidth="1px"
      borderTopWidth="0px"
      direction="column"
    >
      <Box
        h={['60px']}
        p="2"
        bg="gray.50"
        borderColor="gray.500"
        borderTopWidth="1px"
        borderTopRadius="lg"
        borderBottomWidth="1px"
      >
        <Flex alignItems="center">
          <Circle size={['40px']} bg="white">
            <Text fontSize="lg" color="black">
              {data.length}
            </Text>
          </Circle>
          <Text ml="4" fontSize="lg" color="black" fontWeight="bold">
            {title}
          </Text>
        </Flex>
      </Box>
      <ShowIf test={data.length === 0 && Boolean(details)}>
        {() => (
          <Flex flex={1} p="6" alignItems="center">
            <Text fontSize="sm" textColor="gray.700" align="center">
              {details}
            </Text>
          </Flex>
        )}
      </ShowIf>
      <ShowIf test={data.length > 0}>
        {() => (
          <VStack flex={1} p="4" overflowX="hidden">
            {listType === 'businesses'
              ? (data as WithId<Business>[]).map((item) => (
                  <BOBusinessListItem key={item.id} business={item} />
                ))
              : (data as WithId<Order>[]).map((item) => (
                  <BOOrderListItem key={item.id} order={item} />
                ))}
          </VStack>
        )}
      </ShowIf>
    </Flex>
  );
};
