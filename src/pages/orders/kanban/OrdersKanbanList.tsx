import { Order, WithId } from '@appjusto/types';
import { Box, Circle, Flex, FlexProps, Stack, Text } from '@chakra-ui/react';
import { ShowIf } from 'core/components/ShowIf';
import React from 'react';
import { OrdersKanbanListItem } from './OrdersKanbanListItem';

interface OrdersKanbanListProps extends FlexProps {
  title: string;
  orders: WithId<Order>[];
  dataLength?: number;
  details?: string;
  infiniteScroll?: boolean,
  scrollTopLimit?: number,
  loadData?(): void;
}

export const OrdersKanbanList = ({ 
  title, 
  orders, 
  dataLength,
  details, 
  infiniteScroll = false,
  scrollTopLimit = 550,
  loadData,
  ...props 
}: OrdersKanbanListProps) => {
  // refs
  const listRef = React.useRef<HTMLDivElement>(null);
  // helpers
  const dataTotal = typeof dataLength === 'number' ? dataLength : orders.length;
  // side effects
  React.useEffect(() => {
    if (!infiniteScroll || !listRef.current || !loadData) return;
    const handleScrollTop = () => {
      if (listRef.current) {
        let shouldLoad = listRef.current.scrollHeight - listRef.current.scrollTop < scrollTopLimit;
        if (shouldLoad) {
          loadData()
        };
      }
    };
    listRef.current.addEventListener('scroll', handleScrollTop);
    return () => document.removeEventListener('scroll', handleScrollTop);
  }, [infiniteScroll, scrollTopLimit, listRef, loadData]);
  // UI
  return (
    <Flex
      w="100%"
      maxW={{ lg: '300px' }}
      h={['500px']}
      borderRadius="lg"
      borderColor="gray.500"
      borderWidth="1px"
      borderTopWidth="0px"
      direction="column"
      {...props}
    >
      <Box
        h={['60px']}
        p="2"
        bg="#EEEEEE"
        borderColor="gray.500"
        borderTopWidth="1px"
        borderTopRadius="lg"
        borderBottomWidth="1px"
      >
        <Flex alignItems="center">
          <Circle size={['40px']} bg="white">
            <Text fontSize="lg" color="black">
              {dataTotal}
            </Text>
          </Circle>
          <Text ml="4" fontSize="lg" color="black" fontWeight="bold">
            {title}
          </Text>
        </Flex>
      </Box>
      <ShowIf test={orders.length === 0 && Boolean(details)}>
        {() => (
          <Flex flex={1} p="6" alignItems="center">
            <Text fontSize="sm" textColor="gray.700" align="center">
              {details}
            </Text>
          </Flex>
        )}
      </ShowIf>
      <ShowIf test={orders.length > 0}>
        {() => (
          <Stack flex={1} p="4" overflowX="hidden" ref={listRef}>
            {orders.map((order) => (
              <OrdersKanbanListItem key={order.id} order={order} />
            ))}
          </Stack>
        )}
      </ShowIf>
    </Flex>
  );
};
