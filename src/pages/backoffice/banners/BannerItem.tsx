import { WithId } from '@appjusto/types';
import { Box, Flex, HStack, Link, Switch, Text } from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { EditButton } from 'common/components/buttons/EditButton';
import { ReactComponent as DragHandle } from 'common/img/drag-handle.svg';
import { Draggable } from 'react-beautiful-dnd';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { Banner } from '../drawers/banner/types';

interface BannerItemProps {
  index: number;
  banner: WithId<Banner>;
  // isRemoving: boolean;
  handleUpdate(index: number, field: string, value: any): void;
  // removePhone(index: number): void;
}

export const BannerItem = ({
  index,
  banner,
  // isRemoving,
  handleUpdate,
}: // removePhone,
BannerItemProps) => {
  // context
  const { url } = useRouteMatch();
  const { userAbility } = useContextFirebaseUser();
  // UI
  return (
    <Draggable draggableId={`${index}`} index={index}>
      {(draggable) => (
        <Box
          mt="4"
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
          boxShadow="0px 8px 16px -4px rgba(105, 118, 103, 0.1)"
          ref={draggable.innerRef}
          {...draggable.draggableProps}
          w="100%"
          p="4"
        >
          <Flex key={index} justifyContent="space-between" alignItems="center">
            <Box
              display={userAbility?.can('update', 'banners') ? 'flex' : 'none'}
              px="2"
              bg="white"
              {...draggable.dragHandleProps}
              ref={draggable.innerRef}
            >
              <DragHandle />
            </Box>
            <Text>{banner.pageTitle ?? 'Não se aplica'}</Text>
            <Text>{t('Criado: ') + getDateAndHour(banner.createdOn)}</Text>
            <HStack>
              <Switch
                isChecked={banner.enabled}
                onChange={(ev) => {
                  ev.stopPropagation();
                  // updateCategory({ enabled: ev.target.checked });
                }}
              />
              <Link as={RouterLink} to={`${url}/${banner.id}`}>
                <EditButton />
              </Link>
            </HStack>
          </Flex>
        </Box>
      )}
    </Draggable>
  );
};
