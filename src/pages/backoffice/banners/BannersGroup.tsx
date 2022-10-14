import { ClientFlavor, WithId } from '@appjusto/types';
import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { t } from 'utils/i18n';
import { Banner, BannersOrdering } from '../drawers/banner/types';
import { SectionTitle } from '../drawers/generics/SectionTitle';
import { BannerItem } from './BannerItem';
import { getBannersByFlavorOrdered, updateBannerOrdering } from './utils';

interface BannersGroupsProps {
  title: string;
  flavor: ClientFlavor;
  ordering?: BannersOrdering | null;
  updateOrdering(ordering: BannersOrdering): void;
  banners?: WithId<Banner>[] | null;
}

export const BannersGroups = ({
  title,
  flavor,
  ordering,
  updateOrdering,
  banners,
}: BannersGroupsProps) => {
  // state
  const [ordered, setOrdered] = React.useState<WithId<Banner>[] | null>();
  // handlers
  const sortBanners = React.useCallback(
    (currentOrdering?: BannersOrdering | null) => {
      if (!currentOrdering || !banners) return;
      const orderingResult = getBannersByFlavorOrdered(
        currentOrdering[flavor],
        banners
      );
      setOrdered(orderingResult);
    },
    [flavor, banners]
  );
  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return; // dropped outside
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return; // same location
    }
    if (!ordering) return;
    if (source.droppableId !== destination.droppableId) return;
    const newOrdering = updateBannerOrdering(
      ordering,
      flavor,
      source.index,
      destination.index
    );
    sortBanners(newOrdering);
    updateOrdering(newOrdering);
  };
  // side effects
  React.useEffect(() => {
    sortBanners(ordering);
  }, [sortBanners, ordering]);
  // UI
  return (
    <Box
      mt="6"
      py="4"
      px="6"
      border="1px solid #E5E5E5"
      borderRadius="lg"
      alignItems="flex-start"
    >
      <SectionTitle mt="0">{title}</SectionTitle>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={flavor}>
          {(droppable, snapshot) => (
            <Box
              mt="4"
              ref={droppable.innerRef}
              {...droppable.droppableProps}
              bg={snapshot.isDraggingOver ? 'gray.50' : 'white'}
              minH={100}
              w="100%"
              overflow="auto"
            >
              {ordered === undefined ? (
                <Text color="gray.600">{t('Carregando...')}</Text>
              ) : ordered === null || ordered.length === 0 ? (
                <Text color="gray.600">{t('Nenhum banner adicionado')}</Text>
              ) : (
                ordered.map((banner, index) => (
                  <BannerItem key={banner.id} index={index} banner={banner} />
                ))
              )}
              {droppable.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};
