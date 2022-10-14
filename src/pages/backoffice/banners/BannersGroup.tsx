import { WithId } from '@appjusto/types';
import { Box, Text } from '@chakra-ui/react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { Banner } from '../drawers/banner/types';
import { SectionTitle } from '../drawers/generics/SectionTitle';
import { BannerItem } from './BannerItem';
// import { CategoryItem } from './CategoryItem';

interface BannersGroupsProps {
  title: string;
  banners?: WithId<Banner>[] | null;
}

export const BannersGroups = ({ title, banners }: BannersGroupsProps) => {
  // state
  const { url } = useRouteMatch();
  // handlers
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return; // dropped outside
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return; // same location
    if (type === 'product') {
      // updateProductsOrdering(
      //   menu.updateSecondLevelIndex(
      //     productsOrdering,
      //     draggableId, //product id
      //     source.droppableId, // category from
      //     destination.droppableId, // category to
      //     source.index,
      //     destination.index
      //   )
      // );
    } else if (type === 'category') {
      // updateProductsOrdering(
      //   menu.updateFirstLevelIndex(productsOrdering, draggableId, destination.index)
      // );
    }
  };

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
        <Droppable droppableId="banners">
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
              {banners === undefined ? (
                <Text color="gray.600">{t('Carregando...')}</Text>
              ) : banners === null || banners.length === 0 ? (
                <Text color="gray.600">{t('Nenhum banner adicionado')}</Text>
              ) : (
                banners.map((banner, index) => (
                  <BannerItem
                    key={banner.id}
                    index={index}
                    banner={banner}
                    handleUpdate={() => {}}
                  />
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
