import { Box, Button, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { t } from 'utils/i18n';

interface DrawerButtonsProps {
  type: 'categoria' | 'produto' | 'grupo' | 'complemento';
  isLoading: boolean;
  deletingLoading?: boolean;
  isEditing: boolean;
  onDelete(): void;
}

export const DrawerButtons = ({
  type,
  isLoading,
  deletingLoading,
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
          {t('Salvar')}
        </Button>
        {isEditing && (
          <Button
            width="full"
            variant="dangerLight"
            ml={3}
            onClick={() => setDeleteConfirm(true)}
            isDisabled={isLoading}
          >
            {t(`Apagar ${type}`)}
          </Button>
        )}
      </Stack>
    );
  }
  return (
    <Box mt="8" bg="#FFF8F8" border="1px solid red" borderRadius="lg" p="6">
      <Text color="red">
        {t(
          type === 'categoria'
            ? 'Ao apagar a categoria, os itens adicionados a ela também serão excluídos. Tem certeza que deseja excluir essa categoria?'
            : type === 'grupo'
            ? 'Ao apagar o grupo, os itens adicionados a ele também serão excluídos. Tem certeza que deseja excluir esse grupo?'
            : `Tem certeza que deseja excluir este ${type}?`
        )}
      </Text>
      <Stack mt="8" spacing={4} direction="row">
        <Button width="full" onClick={() => setDeleteConfirm(false)}>
          {t(`Manter ${type}`)}
        </Button>
        <Button width="full" variant="danger" onClick={onDelete} isLoading={deletingLoading}>
          {t(`Apagar ${type}`)}
        </Button>
      </Stack>
    </Box>
  );
};
