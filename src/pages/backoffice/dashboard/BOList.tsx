import { Business, Order, ProfileChange, WithId } from '@appjusto/types';
import {
  Box,
  Center,
  Circle,
  Flex,
  FlexProps,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ShowIf } from 'core/components/ShowIf';
import React from 'react';
import { BOBusinessListItem } from './BOBusinessListItem';
import { BOOrderListItem } from './BOOrderListItem';
import { BOProfileChangesListItem } from './BOProfileChangesListItem';
import { FilterOptions, StaffFilter } from './StaffFilter';

export type ListType =
  | 'orders-unsafe'
  | 'orders-warning'
  | 'orders-issue'
  | 'orders-watched'
  | 'businesses'
  | 'profile-changes';

const renderList = (
  data: WithId<Business>[] | WithId<Order>[] | WithId<ProfileChange>[],
  listType: ListType
) => {
  if (listType === 'businesses') {
    return (data as WithId<Business>[]).map((item) => (
      <BOBusinessListItem key={item.id} business={item} />
    ));
  } else if (listType.includes('orders')) {
    return (data as WithId<Order>[]).map((item) => (
      <BOOrderListItem key={item.id} listType={listType} order={item} />
    ));
  } else {
    return (data as WithId<ProfileChange>[]).map((item) => (
      <BOProfileChangesListItem key={item.id} changes={item} />
    ));
  }
};

interface BOListProps extends FlexProps {
  title: string;
  data: WithId<Order>[] | WithId<Business>[] | WithId<ProfileChange>[];
  dataLength?: number;
  listType: ListType;
  details?: string;
  infiniteScroll?: boolean;
  scrollTopLimit?: number;
  filterOptions?: FilterOptions;
  filterValue?: string[];
  handleFilter?(value: string[]): void;
  loadData?(): void;
}

export const BOList = ({
  title,
  data,
  dataLength,
  listType,
  details,
  infiniteScroll = false,
  scrollTopLimit = 240,
  filterOptions,
  filterValue,
  handleFilter,
  loadData,
  ...props
}: BOListProps) => {
  // refs
  const listRef = React.useRef<HTMLDivElement>(null);
  const listHeight = listType.includes('orders') ? '600px' : '300px';
  // helpers
  const isFilter =
    filterOptions !== undefined &&
    filterValue !== undefined &&
    handleFilter !== undefined;
  // side effects
  React.useEffect(() => {
    if (!infiniteScroll || !listRef.current || !loadData) return;
    const handleScrollTop = () => {
      if (listRef.current) {
        let shouldLoad =
          listRef.current.scrollHeight - listRef.current.scrollTop <
          scrollTopLimit;
        if (shouldLoad) {
          loadData();
        }
      }
    };
    listRef.current.addEventListener('scroll', handleScrollTop);
    return () => document.removeEventListener('scroll', handleScrollTop);
  }, [infiniteScroll, scrollTopLimit, listRef, loadData]);
  // UI
  return (
    <Flex
      w="100%"
      position="relative"
      h={listHeight}
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
        <Flex
          alignItems="center"
          justifyContent={isFilter ? 'space-between' : 'flex-start'}
        >
          <HStack spacing={4}>
            <Circle minH="40px" minInlineSize="40px" px="1" bg="white">
              <Text fontSize="lg" color="black">
                {data.length}
              </Text>
            </Circle>
            <Text
              ml="4"
              fontSize={{ base: 'md', lg: 'lg' }}
              color="black"
              fontWeight="bold"
            >
              {title}
            </Text>
          </HStack>
          {isFilter && (
            <StaffFilter
              options={filterOptions!}
              currentValue={filterValue!}
              handleFilter={handleFilter!}
            />
          )}
        </Flex>
      </Box>
      <ShowIf test={data.length === 0}>
        {() => (
          <Center ref={listRef} flex={1} p="4" overflowX="hidden">
            <Text color="gray.600" textAlign="center">
              {details}
            </Text>
          </Center>
        )}
      </ShowIf>
      <ShowIf test={data.length > 0}>
        {() => (
          <VStack ref={listRef} flex={1} p="4" overflowX="hidden">
            {renderList(data, listType)}
          </VStack>
        )}
      </ShowIf>
    </Flex>
  );
};
