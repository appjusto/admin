import { useContextApi } from 'app/state/api/context';
import { WithId, ProfileNote } from 'appjusto-types';
import React from 'react';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useObserveConsumerProfileNotes = (consumerId?: string) => {
  // contex
  const api = useContextApi();
  // state
  const [profileNotes, setProfileNotes] = React.useState<WithId<ProfileNote>[]>([]);
  // mutations
  const { mutateAsync: updateNote, mutationResult: updateResult } = useCustomMutation(
    async (data: { changes: Partial<ProfileNote>; id?: string }) => {
      if (!data.id) return await api.consumer().createProfileNote(consumerId!, data.changes);
      else return await api.consumer().updateProfileNote(consumerId!, data.id, data.changes);
    },
    'updateNote'
  );
  const { mutateAsync: deleteNote, mutationResult: deleteResult } = useCustomMutation(
    async (profileNoteId: string) =>
      await api.consumer().deleteProfileNote(consumerId!, profileNoteId),
    'deleteNote'
  );
  // side effects
  React.useEffect(() => {
    if (!consumerId) return;
    const unsub = api.consumer().observeConsumerProfileNotes(consumerId, setProfileNotes);
    return () => unsub();
  }, [api, consumerId]);
  // return
  return { profileNotes, updateNote, updateResult, deleteNote, deleteResult };
};
