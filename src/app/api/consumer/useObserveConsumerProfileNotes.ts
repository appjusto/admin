import { ProfileNote, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useObserveConsumerProfileNotes = (consumerId?: string) => {
  // contex
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('consumers');
  // state
  const [profileNotes, setProfileNotes] = React.useState<WithId<ProfileNote>[]>(
    []
  );
  // mutations
  const { mutate: updateNote, mutationResult: updateResult } =
    useCustomMutation(
      (data: { changes: Partial<ProfileNote>; id?: string }) => {
        if (!data.id)
          return api.consumer().createProfileNote(consumerId!, data.changes);
        else
          return api
            .consumer()
            .updateProfileNote(consumerId!, data.id, data.changes);
      },
      'updateNote'
    );
  const { mutate: deleteNote, mutationResult: deleteResult } =
    useCustomMutation(
      (profileNoteId: string) =>
        api.consumer().deleteProfileNote(consumerId!, profileNoteId),
      'deleteNote',
      false
    );
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!consumerId) return;
    const unsub = api
      .consumer()
      .observeConsumerProfileNotes(consumerId, setProfileNotes);
    return () => unsub();
  }, [api, userCanRead, consumerId]);
  // return
  return { profileNotes, updateNote, updateResult, deleteNote, deleteResult };
};
