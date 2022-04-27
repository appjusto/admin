import { Business, Order, ProfileChange, WithId } from '@appjusto/types';
import { Box, Circle, Flex, FlexProps, Text, VStack } from '@chakra-ui/react';
import { ShowIf } from 'core/components/ShowIf';
import React from 'react';
import { BOBusinessListItem } from './BOBusinessListItem';
import { BOOrderListItem } from './BOOrderListItem';
import { BOProfileChangesListItem } from './BOProfileChangesListItem';

type ListType = 'orders' | 'businesses' | 'profile-changes';

interface BOListProps extends FlexProps {
  title: string;
  data: WithId<Business>[] | WithId<Order>[] | WithId<ProfileChange>[];
  listType: ListType;
  details?: string;
  infiniteScroll?: boolean;
  loadData?(): void;
}

export const BOList = ({
  title,
  data,
  listType,
  details,
  infiniteScroll = false,
  loadData,
  ...props
}: BOListProps) => {
  // refs
  const listRef = React.useRef<HTMLDivElement>(null);
  // side effects
  React.useEffect(() => {
    if (!infiniteScroll || !listRef.current || !loadData) return;
    const handleScrollTop = () => {
      if (listRef.current) {
        let shouldLoad = listRef.current.scrollHeight - listRef.current.scrollTop < 240;
        if (shouldLoad) loadData();
      }
    };
    listRef.current.addEventListener('scroll', handleScrollTop);
    return () => document.removeEventListener('scroll', handleScrollTop);
  }, [infiniteScroll, listRef, loadData]);
  // UI
  return (
    <Flex
      w="100%"
      position="relative"
      h={listType === 'orders' ? '600px' : '300px'}
      borderRadius="lg"
      borderColor="gray.500"
      borderWidth="1px"
      borderTopWidth="0px"
      direction="column"
      {...props}
    >
      <Box
        minH="60px"
        p="2"
        bg="#EEEEEE"
        borderColor="gray.500"
        borderTopWidth="1px"
        borderTopRadius="lg"
        borderBottomWidth="1px"
      >
        <Flex alignItems="center">
          <Circle size="40px" bg="white">
            <Text fontSize="lg" color="black">
              {data.length}
            </Text>
          </Circle>
          <Text ml="4" fontSize={{ base: 'md', lg: 'lg' }} color="black" fontWeight="bold">
            {title}
          </Text>
        </Flex>
      </Box>
      <ShowIf test={data.length === 0 && Boolean(details)}>
        {() => (
          <Flex flex={1} p="6" alignItems="center" justifyContent="center">
            <Text fontSize="sm" textColor="gray.700" align="center">
              {details}
            </Text>
          </Flex>
        )}
      </ShowIf>
      <ShowIf test={data.length > 0}>
        {() => (
          <VStack ref={listRef} flex={1} p="4" overflowX="hidden">
            {listType === 'businesses'
              ? (data as WithId<Business>[]).map((item) => (
                  <BOBusinessListItem key={item.id} business={item} />
                ))
              : listType === 'orders'
              ? (data as WithId<Order>[]).map((item) => (
                  <BOOrderListItem key={item.id} order={item} />
                ))
              : (data as WithId<ProfileChange>[]).map((item) => (
                  <BOProfileChangesListItem key={item.id} changes={item} />
                ))}
          </VStack>
        )}
      </ShowIf>
    </Flex>
  );
};
