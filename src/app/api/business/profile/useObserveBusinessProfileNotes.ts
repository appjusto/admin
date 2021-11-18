import { useCustomMutation } from 'app/api/mutation/useCustomMutation';
import { useContextApi } from 'app/state/api/context';
import { WithId, ProfileNote } from 'appjusto-types';
import React from 'react';

export const useObserveBusinessProfileNotes = (businessId?: string) => {
  // contex
  const api = useContextApi();
  // state
  const [profileNotes, setProfileNotes] = React.useState<WithId<ProfileNote>[]>([]);
  // mutations
  const { mutateAsync: updateNote, mutationResult: updateResult } = useCustomMutation(
    async (data: { changes: Partial<ProfileNote>; id?: string }) => {
      if (!data.id) return await api.business().createProfileNote(businessId!, data.changes);
      else return await api.business().updateProfileNote(businessId!, data.id, data.changes);
    },
    'updateNote'
  );
  const { mutateAsync: deleteNote, mutationResult: deleteResult } = useCustomMutation(
    async (profileNoteId: string) =>
      await api.business().deleteProfileNote(businessId!, profileNoteId),
    'deleteNote',
    false
  );
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    const unsub = api.business().observeBusinessProfileNotes(businessId, setProfileNotes);
    return () => unsub();
  }, [api, businessId]);
  // return
  return { profileNotes, updateNote, updateResult, deleteNote, deleteResult };
};
