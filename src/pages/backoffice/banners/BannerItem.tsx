import { Banner, WithId } from '@appjusto/types';
import { Box, Flex, HStack, Link, Switch, Text } from '@chakra-ui/react';
import { useObserveBanner } from 'app/api/banners/useObserveBanner';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextStaffProfile } from 'app/state/staff/context';
import { EditButton } from 'common/components/buttons/EditButton';
import { ReactComponent as DragHandle } from 'common/img/drag-handle.svg';
import { Draggable } from 'react-beautiful-dnd';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface BannerItemProps {
  index: number;
  banner: WithId<Banner>;
}

export const BannerItem = ({ index, banner }: BannerItemProps) => {
  // context
  const { url } = useRouteMatch();
  const { userAbility } = useContextFirebaseUser();
  const { staff } = useContextStaffProfile();
  const { updateBanner } = useObserveBanner();
  // handlers
  const handleEnabledChange = (value: boolean) => {
    if (!staff?.id || !staff.email) return;
    updateBanner({
      id: banner.id,
      changes: {
        updatedBy: {
          id: staff.id,
          email: staff.email,
          name: staff.name ?? '',
        },
        enabled: value,
      },
    });
  };
  // UI
  return (
    <Draggable draggableId={banner.id} index={index}>
      {(draggable) => (
        <Flex
          {...draggable.draggableProps}
          ref={draggable.innerRef}
          mt="4"
          borderWidth="1px"
          borderRadius="lg"
          justifyContent="space-between"
          alignItems="center"
          bg="white"
          boxShadow="0px 8px 16px -4px rgba(105, 118, 103, 0.1)"
          w="100%"
          p="4"
        >
          <Box
            {...draggable.dragHandleProps}
            display={userAbility?.can('update', 'banners') ? 'flex' : 'none'}
            px="2"
            bg="white"
            ref={draggable.innerRef}
          >
            <DragHandle />
          </Box>
          <Text fontWeight="700">{banner.name ?? 'Não se aplica'}</Text>
          <HStack spacing={{ base: 1, md: 6 }}>
            <Text display={{ base: 'none', md: 'block' }}>
              <Text as="span" fontWeight="700">
                {t('Atualizado: ')}
              </Text>
              {getDateAndHour(banner.updatedOn)}
            </Text>
            <Switch
              isChecked={banner.enabled}
              onChange={(ev) => {
                ev.stopPropagation();
                handleEnabledChange(ev.target.checked);
              }}
            />
            <Link as={RouterLink} to={`${url}/${banner.id}`}>
              <EditButton ml="0" />
            </Link>
          </HStack>
        </Flex>
      )}
    </Draggable>
  );
};
