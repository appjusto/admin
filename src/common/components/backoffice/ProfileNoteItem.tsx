import { ProfileNote, WithId } from '@appjusto/types';
import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react';
import { useContextAgentProfile } from 'app/state/agent/context';
import { CustomTextarea as Textarea } from 'common/components/form/input/CustomTextarea';
import React from 'react';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { DeleteButton } from '../buttons/DeleteButton';
import { EditButton } from '../buttons/EditButton';

interface ProfileNoteItemProps {
  profileNote: WithId<ProfileNote>;
  updateNote(id: string, note: string): void;
  deleteNote(id: string): void;
  isLoading: boolean;
  //updateResult: MutationResult<void, unknown>;
  //deleteResult: MutationResult<void, unknown>;
}

export const ProfileNoteItem = ({
  profileNote,
  updateNote,
  deleteNote,
  isLoading,
}: ProfileNoteItemProps) => {
  // context
  const { agent } = useContextAgentProfile();
  // state
  const [isEditing, setIsEditing] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [note, setNote] = React.useState(profileNote.note ?? '');
  // UI
  return (
    <Box mt="4" bgColor="white" border="1px solid #ECF0E3" borderRadius="16px" p="4">
      <Flex justifyContent="space-between">
        <Text fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
          {t('Agente:')}{' '}
          <Text as="span" fontWeight="500">
            {profileNote.agentName ?? profileNote.agentEmail}
          </Text>
        </Text>
        <Text fontSize="13px" lineHeight="18px">
          {getDateAndHour(profileNote.createdOn)}
        </Text>
      </Flex>
      {isEditing ? (
        <Box mt="4">
          <Textarea
            id="new-note"
            bgColor="white"
            label={'Nova anotação'}
            value={note}
            onChange={(ev) => setNote(ev.target.value)}
          />
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
              onClick={() => {
                updateNote(profileNote.id, note);
                setIsEditing(false);
              }}
              isLoading={isLoading}
              loadingText={t('Salvando')}
            >
              {t('Salvar')}
            </Button>
          </HStack>
        </Box>
      ) : (
        <>
          {isDeleting ? (
            <Flex mt="4" flexDir="column" alignItems="flex-end">
              <Text>{t('Tem certeza que deseja deletar esta anotação?')}</Text>
              <HStack mt="2" spacing={4}>
                <Button size="md" minW="160px" onClick={() => setIsDeleting(false)}>
                  {t('Cancelar')}
                </Button>
                <Button
                  size="md"
                  minW="160px"
                  variant="danger"
                  onClick={() => {
                    deleteNote(profileNote.id);
                    setIsDeleting(false);
                  }}
                >
                  {t('Deletar')}
                </Button>
              </HStack>
            </Flex>
          ) : (
            <Flex mt="4" flexDir="row" justifyContent="space-between" alignItems="center">
              <Text flex={3} fontSize="15px" color="black" fontWeight="500" lineHeight="22px">
                {profileNote.note}
              </Text>
              {profileNote.agentId === agent?.id && (
                <HStack flex={1} spacing={4} justifyContent="flex-end">
                  <EditButton onClick={() => setIsEditing(true)} />
                  <DeleteButton onClick={() => setIsDeleting(true)} />
                </HStack>
              )}
            </Flex>
          )}
        </>
      )}
    </Box>
  );
};
