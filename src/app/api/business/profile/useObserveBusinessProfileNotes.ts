import { ProfileNote, WithId } from '@appjusto/types';
import { useCustomMutation } from 'app/api/mutation/useCustomMutation';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useObserveBusinessProfileNotes = (businessId?: string) => {
  // contex
  const api = useContextApi();
  // state
  const [profileNotes, setProfileNotes] = React.useState<WithId<ProfileNote>[]>([]);
  // mutations
  const { mutate: updateNote, mutationResult: updateResult } = useCustomMutation(
    (data: { changes: Partial<ProfileNote>; id?: string }) => {
      if (!data.id) return api.business().createProfileNote(businessId!, data.changes);
      else return api.business().updateProfileNote(businessId!, data.id, data.changes);
    },
    'updateNote'
  );
  const { mutate: deleteNote, mutationResult: deleteResult } = useCustomMutation(
    (profileNoteId: string) => api.business().deleteProfileNote(businessId!, profileNoteId),
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
