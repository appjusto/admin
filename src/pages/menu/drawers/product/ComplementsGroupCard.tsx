import { ComplementGroup, WithId } from '@appjusto/types';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  Text,
} from '@chakra-ui/react';
import { useContextMenu } from 'app/state/menu/context';
import { isEqual } from 'lodash';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { slugfyName } from 'utils/functions';
import { t } from 'utils/i18n';

interface ComplementsGroupCardProps {
  group: WithId<ComplementGroup>;
}

const ComplementsGroupCard = ({ group }: ComplementsGroupCardProps) => {
  // context
  const router = useHistory();
  const { setIsProductPage } = useContextMenu();
  // handlers
  const makeGroupItemVisible = () => {
    setIsProductPage(false);
    router.push(`/app/menu?group=${group.id}`);
  };
  // UI
  return (
    <Flex
      w="100%"
      p="4"
      border="1px solid #D7E7DA"
      borderRadius="lg"
      justifyContent="space-between"
      alignItems="center"
    >
      <Checkbox
        w="100%"
        value={group.id}
        isDisabled={group.items?.length === 0}
        aria-label={`${slugfyName(group.name)}-checkbox`}
      >
        <Box ml="2">
          <HStack spacing={2}>
            <Text>{group.name}</Text>
            {!group.enabled && (
              <Badge px="2" borderRadius="lg">
                {t('Indisponível')}
              </Badge>
            )}
          </HStack>
          <Text fontSize="sm" color="gray.700">{`${
            group.required ? 'Obrigatório' : 'Opcional'
          }. Mín: ${group.minimum}. Máx: ${group.maximum}`}</Text>
          <Text
            fontSize="sm"
            color={group.items?.length === 0 ? 'red' : 'gray.700'}
          >
            {group.items && group.items.length > 0
              ? `Itens: ${group.items.map((item) => item.name).join(', ')}`
              : 'Nenhum item cadastrado'}
          </Text>
        </Box>
      </Checkbox>
      <Button
        w="160px"
        size="sm"
        fontSize="15px"
        variant="outline"
        onClick={makeGroupItemVisible}
      >
        {t('Ver detalhes')}
      </Button>
    </Flex>
  );
};

const areEqual = (
  prevProps: ComplementsGroupCardProps,
  nextProps: ComplementsGroupCardProps
) => {
  return isEqual(prevProps, nextProps);
};

export default React.memo(ComplementsGroupCard, areEqual);
