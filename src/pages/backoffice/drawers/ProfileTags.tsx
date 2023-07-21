import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  HStack,
  Tag,
  TagLabel,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import React from 'react';
import { t } from 'utils/i18n';
interface ProfileTagsProps<T> {
  tags?: T[];
  options: T[];
  updateProfile: (tags: T[]) => void;
  isLoading: boolean;
  isSuccess: boolean;
}

export const ProfileTags = <T,>({
  tags,
  options,
  updateProfile,
  isLoading,
  isSuccess,
}: ProfileTagsProps<T>) => {
  // state
  const [stateTags, setStateTags] = React.useState<T[]>([]);
  const [isEditing, setIsEditing] = React.useState(false);
  // handlers
  const handleAddTag = () => {
    updateProfile(stateTags);
  };
  // side effects
  React.useEffect(() => {
    if (!tags) return;
    setStateTags(tags);
  }, [tags]);
  React.useEffect(() => {
    if (!isSuccess) return;
    setIsEditing(false);
  }, [isSuccess]);
  // UI
  return (
    <Box
      mt="6"
      bgColor="#F6F6F6"
      borderRadius="16px"
      p="4"
      maxH="400px"
      overflowY="auto"
    >
      {isEditing ? (
        <Box p="4" bgColor="white" borderRadius="lg">
          <CheckboxGroup
            colorScheme="green"
            value={stateTags as unknown as string[]}
            onChange={(values) => setStateTags(values as unknown as T[])}
          >
            <Text fontWeight="700">{t('Tags disponíveis:')}</Text>
            <Wrap mt="2" spacing={6}>
              {options.map((tag) => {
                return (
                  <WrapItem key={tag as unknown as string}>
                    <Checkbox value={tag as unknown as string}>{tag}</Checkbox>
                  </WrapItem>
                );
              })}
            </Wrap>
          </CheckboxGroup>
          <HStack mt="4" justifyContent="flex-end" spacing={4}>
            <Button
              size="md"
              w={{ base: '90px', md: '160px' }}
              variant="dangerLight"
              onClick={() => setIsEditing(false)}
            >
              {t('Cancelar')}
            </Button>
            <Button
              size="md"
              w={{ base: '90px', md: '160px' }}
              onClick={handleAddTag}
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
            onClick={() => setIsEditing(true)}
          >
            {t('Editar tags')}
          </Text>
        </Flex>
      )}
      <Box mt="4">
        {stateTags.length > 0 ? (
          stateTags.map((tag) => (
            <Tag
              key={tag as unknown as string}
              px="4"
              py="1"
              bgColor="white"
              mr="2"
            >
              <TagLabel>{tag}</TagLabel>
            </Tag>
          ))
        ) : (
          <Text mt="6">{t('Ainda não há tags para este perfil.')}</Text>
        )}
      </Box>
    </Box>
  );
};
