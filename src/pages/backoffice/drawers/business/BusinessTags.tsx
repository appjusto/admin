import { Box, Button, Flex, HStack, Tag, TagCloseButton, TagLabel, Text } from "@chakra-ui/react";
import { useBusinessProfile } from "app/api/business/profile/useBusinessProfile";
import { useContextBusinessBackoffice } from "app/state/business/businessBOContext";
import { CustomInput } from "common/components/form/input/CustomInput";
import React from "react";
import { t } from "utils/i18n";

type IsRemoving = {
  status: boolean;
  tag?: string;
}

export const BusinessTags = () => {
  // context
  const { business } = useContextBusinessBackoffice();
  const { updateBusinessProfile, updateResult } = useBusinessProfile();
  const { isLoading, isSuccess } = updateResult;
  // state
  const [state, setState] = React.useState<string[]>([]);
  const [newTag, setNewTag] = React.useState('');
  const [isAdding, setIsAdding] = React.useState(false);
  const [isRemoving, setIsRemoving] = React.useState<IsRemoving>(
    { status: false }
  );
  // helpers
  const isRemovingTag = (tag: string) =>
    isRemoving.status === true && isRemoving.tag === tag;
  // handlers
  const handleAddNote = () => {
    const tags = [...state, newTag];
    updateBusinessProfile({ tags });
  };
  const handleRemove = () => {
    const tags = state.filter(tag => tag !== isRemoving.tag);
    updateBusinessProfile({ tags });
  }
  // side effects
  React.useEffect(() => {
    if(!business?.tags) return;
    setState(business?.tags);
  }, [business?.tags]);
  React.useEffect(() => {
    if(!isSuccess) return;
    setIsAdding(false);
    setIsRemoving({ status: false })
  }, [isSuccess]);
  React.useEffect(() => {
    if(isAdding) return;
    setNewTag('')
  }, [isAdding])
  // UI
  return (
    <Box mt="6" bgColor="#F6F6F6" borderRadius="16px" p="4" maxH="400px" overflowY="auto">
      {isAdding ? (
        <Box>
          <CustomInput
            id="new-note"
            bgColor="white"
            label={'Nova tag'}
            value={newTag}
            onChange={(ev) => setNewTag(ev.target.value)}
          />
          <HStack mt="4" justifyContent="flex-end" spacing={4}>
            <Button
              size="md"
              w={{ base: '90px', md: '160px' }}
              variant="dangerLight"
              onClick={() => setIsAdding(false)}
            >
              {t('Cancelar')}
            </Button>
            <Button
              size="md"
              w={{ base: '90px', md: '160px' }}
              onClick={handleAddNote}
              isLoading={isLoading}
              loadingText={t('Salvando')}
            >
              {t('Salvar')}
            </Button>
          </HStack>
        </Box>
      ) : (
        <Flex justifyContent="flex-end">
          <Text
            color="green.600"
            textDecor="underline"
            cursor="pointer"
            onClick={() => setIsAdding(true)}
          >
            {t('+ Adicionar tag')}
          </Text>
        </Flex>
      )}
      <Box mt="4">
        {
          state.length > 0 ? state.map(tag => (
            <Tag 
              key={tag} 
              px="4" 
              py="1" 
              bgColor={isRemovingTag(tag) ? '#FFF8F8' : 'white'}
              mr="2"
            >
              <TagLabel>{tag}</TagLabel>
              <TagCloseButton onClick={
                () => setIsRemoving({status: true, tag})
              }/>
            </Tag>
          ))
          : (
            <Text mt="6">{t('Ainda não há tags para este restaurante.')}</Text>
        )}
      </Box>
      {
        isRemoving.status && (
          <Flex 
            mt="4"
            p="4"
            bgColor="#FFF8F8"
            borderRadius="lg"
            flexDir="column" 
            justifyContent="space-between" 
            alignItems="center"
          >
            <Text>
              {t('Deseja remover a tag ')}
              <Text as="span" fontWeight="700">{isRemoving.tag}?</Text>
            </Text>
            <HStack mt="4" justifyContent="flex-end" spacing={4}>
            <Button
              size="md"
              w={{ base: '90px', md: '160px' }}
              onClick={() => setIsRemoving({ status: false})}
            >
              {t('Manter')}
            </Button>
            <Button
              size="md"
              w={{ base: '90px', md: '160px' }}
              variant="danger"
              onClick={handleRemove}
              isLoading={isRemoving.status && isLoading}
              loadingText={t('Removendo')}
            >
              {t('Remover')}
            </Button>
          </HStack>
          </Flex>
        )
      }
    </Box>
  )
}