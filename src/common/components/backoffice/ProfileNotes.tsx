import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react';
import { FirebaseError } from 'app/api/types';
import { useContextAgentProfile } from 'app/state/agent/context';
import { ProfileNote, WithId } from 'appjusto-types';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import { CustomTextarea as Textarea } from 'common/components/form/input/CustomTextarea';
import { omitBy } from 'lodash';
import React from 'react';
import { MutateFunction, MutationResult } from 'react-query';
import { t } from 'utils/i18n';
import { ProfileNoteItem } from './ProfileNoteItem';

interface ProfileNotesProps {
  profileNotes: WithId<ProfileNote>[];
  updateNote: MutateFunction<
    void,
    unknown,
    { changes: Partial<ProfileNote>; id?: string },
    unknown
  >;
  deleteNote(profileNoteId: string): void;
  updateResult: MutationResult<void, unknown>;
  deleteResult: MutationResult<void, unknown>;
}

export const ProfileNotes = ({
  profileNotes,
  updateNote,
  deleteNote,
  updateResult,
  deleteResult,
}: ProfileNotesProps) => {
  // props
  const { isLoading, isSuccess, isError, error: updateError } = updateResult;
  // context
  const { agent } = useContextAgentProfile();
  // state
  const [isAdding, setIsAdding] = React.useState(false);
  const [newNote, setNewNote] = React.useState('');
  const [error, setError] = React.useState(initialError);
  // refs
  const submission = React.useRef(0);
  // handlers
  const handleAddNote = () => {
    setError(initialError);
    if (!newNote)
      return setError({
        status: true,
        error: deleteResult.error,
        message: { title: 'É preciso escrever alguma anotação.' },
      });
    if (!agent?.id || !agent?.email)
      return setError({
        status: true,
        error: deleteResult.error,
        message: { title: 'Não foi possível acessar as informações do seu usuário.' },
      });
    submission.current += 1;
    let changes = {
      agentId: agent.id,
      agentEmail: agent.email,
      agentName: agent?.name,
      note: newNote,
    } as Partial<ProfileNote>;
    changes = omitBy(changes, (value) => !value);
    updateNote({ changes });
  };
  const handleUpdateNote = (id: string, note: string) => {
    setError(initialError);
    if (!id || !note)
      return setError({
        status: true,
        error: deleteResult.error,
        message: { title: 'Anotação não encontrada.' },
      });
    if (!agent?.id || !agent?.email)
      return setError({
        status: true,
        error: deleteResult.error,
        message: { title: 'Não foi possível acessar as informações do seu usuário.' },
      });
    submission.current += 1;
    let changes = {
      agentName: agent?.name,
      note,
    } as Partial<ProfileNote>;
    changes = omitBy(changes, (value) => !value);
    updateNote({ changes, id });
  };
  const handleDeleteNote = (id: string) => {
    if (!id) return;
    deleteNote(id);
  };
  // side effects
  React.useEffect(() => {
    if (isSuccess) {
      setIsAdding(false);
      setNewNote('');
    }
  }, [isSuccess]);
  React.useEffect(() => {
    if (isError) {
      setError({
        status: true,
        error: updateError,
      });
    } else if (deleteResult.isError) {
      const errorMessage = (deleteResult.error as FirebaseError).message;
      setError({
        status: true,
        error: deleteResult.error,
        message: { title: errorMessage ?? 'Não foi possível acessar o servidor' },
      });
    }
  }, [isError, updateError, deleteResult.isError, deleteResult.error]);
  // UI
  return (
    <Box mt="6" bgColor="#F6F6F6" borderRadius="16px" p="4" maxH="400px" overflowY="auto">
      {isAdding ? (
        <Box>
          <Textarea
            id="new-note"
            bgColor="white"
            label={'Nova anotação'}
            value={newNote}
            onChange={(ev) => setNewNote(ev.target.value)}
          />
          <HStack mt="4" justifyContent="flex-end" spacing={4}>
            <Button size="md" minW="160px" variant="dangerLight" onClick={() => setIsAdding(false)}>
              {t('Cancelar')}
            </Button>
            <Button
              size="md"
              minW="160px"
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
            {t('+ Adicionar anotação')}
          </Text>
        </Flex>
      )}
      {profileNotes.length > 0 ? (
        profileNotes.map((note) => {
          return (
            <ProfileNoteItem
              key={note.id}
              profileNote={note}
              updateNote={handleUpdateNote}
              deleteNote={handleDeleteNote}
              isLoading={isLoading ?? deleteResult.isLoading}
            />
          );
        })
      ) : (
        <Text mt="6">{t('Ainda não há anotações para este perfil.')}</Text>
      )}
      <SuccessAndErrorHandler
        submission={submission.current}
        isSuccess={isSuccess}
        isError={error.status}
        error={error.error}
        errorMessage={error.message}
      />
    </Box>
  );
};
