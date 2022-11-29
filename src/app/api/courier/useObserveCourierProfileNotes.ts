import { ProfileNote, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useObserveCourierProfileNotes = (courierId?: string) => {
  // contex
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('couriers');
  // state
  const [profileNotes, setProfileNotes] = React.useState<WithId<ProfileNote>[]>(
    []
  );
  // mutations
  const { mutate: updateNote, mutationResult: updateResult } =
    useCustomMutation(
      (data: { changes: Partial<ProfileNote>; id?: string }) => {
        if (!data.id)
          return api.courier().createProfileNote(courierId!, data.changes);
        else
          return api
            .courier()
            .updateProfileNote(courierId!, data.id, data.changes);
      },
      'updateNote'
    );
  const { mutate: deleteNote, mutationResult: deleteResult } =
    useCustomMutation(
      (profileNoteId: string) =>
        api.courier().deleteProfileNote(courierId!, profileNoteId),
      'deleteNote',
      false
    );
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!courierId) return;
    const unsub = api
      .courier()
      .observeCourierProfileNotes(courierId, setProfileNotes);
    return () => unsub();
  }, [api, userCanRead, courierId]);
  // return
  return { profileNotes, updateNote, updateResult, deleteNote, deleteResult };
};
