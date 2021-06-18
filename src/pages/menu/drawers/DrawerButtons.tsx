import { Box, Button, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { t } from 'utils/i18n';

interface DrawerButtonsProps {
  type: string;
  isLoading: boolean;
  isEditing: boolean;
  onDelete(): void;
}

export const DrawerButtons = ({
  type,
  isLoading,
  isEditing,
  onDelete,
  ...props
}: DrawerButtonsProps) => {
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  if (!deleteConfirm) {
    return (
      <Stack mt="8" spacing={4} direction="row" {...props}>
        <Button
          type="submit"
          width="full"
          maxW="50%"
          isLoading={isLoading}
          loadingText={t('Salvando')}
        >
          <Text as="span">{t('Salvar')}</Text>
        </Button>
        {isEditing && (
          <Button
            width="full"
            variant="dangerLight"
            ml={3}
            onClick={() => setDeleteConfirm(true)}
            isDisabled={isLoading}
          >
            {type === 'category' ? t('Apagar categoria') : t('Apagar produto')}
          </Button>
        )}
      </Stack>
    );
  }
  return (
    <Box mt="8" bg="#FFF8F8" border="1px solid red" borderRadius="lg" p="6">
      <Text color="red">
        {type === 'category' ? (
          <Text as="span">
            {t(
              'Ao apagar a categoria, os itens adicionados a ela também serão excluídos. Tem certeza que deseja excluir essa categoria?'
            )}
          </Text>
        ) : (
          <Text as="span">{t('Tem certeza que deseja excluir este produto?')}</Text>
        )}
      </Text>
      <Stack mt="8" spacing={4} direction="row">
        <Button width="full" onClick={() => setDeleteConfirm(false)}>
          {type === 'category' ? (
            <Text as="span">{t('Manter categoria')}</Text>
          ) : (
            <Text as="span">{t('Manter produto')}</Text>
          )}
        </Button>
        <Button width="full" variant="danger" onClick={onDelete}>
          {type === 'category' ? (
            <Text as="span">{t('Apagar categoria')}</Text>
          ) : (
            <Text as="span">{t('Apagar produto')}</Text>
          )}
        </Button>
      </Stack>
    </Box>
  );
};
