import { Complement, WithId } from '@appjusto/types';
import { Box, Flex, Image, Link, Spacer, Switch, Text, Tooltip } from '@chakra-ui/react';
import { useComplementImage } from 'app/api/business/complements/useComplementImage';
import { useContextMenu } from 'app/state/menu/context';
import { EditButton } from 'common/components/buttons/EditButton';
import { ImageFbLoading } from 'common/components/ImageFbLoading';
import { ReactComponent as DragHandle } from 'common/img/drag-handle.svg';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import { slugfyName } from 'utils/functions';
import { t } from 'utils/i18n';
import { CurrencyInput } from '../../../common/components/form/input/currency-input/CurrencyInput2';

interface Props {
  complement: WithId<Complement>;
  index: number;
}

export const ComplementItem = React.memo(({ complement, index }: Props) => {
  // context
  const { url } = useRouteMatch();
  const { updateComplement } = useContextMenu();
  const hookImageUrl = useComplementImage(complement.id);
  //state
  const [imageUrl, setImageUrl] = React.useState<string>('');
  const [price, setPrice] = React.useState(0);

  //handlres
  const updatePriceState = (value: number | undefined) => {
    if (value || value === 0) setPrice(value);
  };

  const onUpdateComplement = async (updateEnabled?: boolean, value?: boolean) => {
    let dataToUpdate = { ...complement };
    //@ts-ignore
    delete dataToUpdate.id;
    if (updateEnabled) {
      await updateComplement({
        groupId: undefined,
        complementId: complement.id,
        changes: { ...dataToUpdate, price, enabled: value },
      });
    } else
      await updateComplement({
        groupId: undefined,
        complementId: complement.id,
        changes: { ...dataToUpdate, price },
      });
  };

  //side effects
  React.useEffect(() => {
    if (!complement?.imageExists) setImageUrl('/static/media/product-placeholder.png');
    else if (hookImageUrl) setImageUrl(hookImageUrl);
  }, [complement?.imageExists, hookImageUrl]);

  React.useEffect(() => {
    updatePriceState(complement.price);
  }, [complement.price]);

  // UI
  return (
    <Draggable draggableId={complement.id} index={index}>
      {(draggable, snapshot) => (
        <Flex
          bg="white"
          mb="4"
          borderWidth="1px"
          borderRadius="lg"
          alignItems="center"
          p="2"
          ref={draggable.innerRef}
          {...draggable.draggableProps}
          pos="relative"
          minW="700px"
        >
          <Box mr="4" bg="white" {...draggable.dragHandleProps} ref={draggable.innerRef}>
            <DragHandle />
          </Box>
          <Link
            as={RouterLink}
            to={`${url}/complement/${complement.id}`}
            width="96px"
            minW="96px"
            height="96px"
            _focus={{ outline: 'none' }}
          >
            <Image
              src={imageUrl}
              width="100%"
              objectFit="cover"
              borderRadius="lg"
              alt="Product image"
              fallback={<ImageFbLoading width="96px" height="96px" />}
            />
          </Link>
          <Flex w="100%" justifyContent="space-between" px="8">
            <Box bg="white" mr="2">
              <Text fontSize="lg" fontWeight="bold">
                {complement.name}
              </Text>
              <Text fontSize="sm">{complement.description}</Text>
            </Box>
            <Flex w="120px" minW="120px" alignItems="center">
              <CurrencyInput
                mt="0"
                id={`prod-${complement.id}-price`}
                label={t('Preço')}
                value={price}
                onChangeValue={updatePriceState}
                onBlur={() => onUpdateComplement()}
                maxLength={6}
              />
            </Flex>
          </Flex>
          <Spacer />
          <Switch
            isChecked={complement.enabled}
            onChange={(ev) => {
              ev.stopPropagation();
              onUpdateComplement(true, ev.target.checked);
            }}
          />
          <Link as={RouterLink} to={`${url}/complement/${complement.id}`}>
            <Tooltip placement="top" label={t('Editar')} aria-label={t('Editar')}>
              <EditButton aria-label={`editar-complemento-${slugfyName(complement.name)}`} />
            </Tooltip>
          </Link>
        </Flex>
      )}
    </Draggable>
  );
});
