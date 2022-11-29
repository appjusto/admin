import { ProfileNote, WithId } from '@appjusto/types';
import { useUserCanReadEntity } from 'app/api/auth/useUserCanReadEntity';
import { useCustomMutation } from 'app/api/mutation/useCustomMutation';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useObserveBusinessProfileNotes = (businessId?: string) => {
  // contex
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('businesses');
  // state
  const [profileNotes, setProfileNotes] = React.useState<WithId<ProfileNote>[]>(
    []
  );
  // mutations
  const { mutate: updateNote, mutationResult: updateResult } =
    useCustomMutation(
      (data: { changes: Partial<ProfileNote>; id?: string }) => {
        if (!data.id)
          return api.business().createProfileNote(businessId!, data.changes);
        else
          return api
            .business()
            .updateProfileNote(businessId!, data.id, data.changes);
      },
      'updateNote'
    );
  const { mutate: deleteNote, mutationResult: deleteResult } =
    useCustomMutation(
      (profileNoteId: string) =>
        api.business().deleteProfileNote(businessId!, profileNoteId),
      'deleteNote',
      false
    );
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!businessId) return;
    const unsub = api
      .business()
      .observeBusinessProfileNotes(businessId, setProfileNotes);
    return () => unsub();
  }, [api, userCanRead, businessId]);
  // return
  return { profileNotes, updateNote, updateResult, deleteNote, deleteResult };
};
