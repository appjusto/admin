import { ProfileNote, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useOrderNotes = (orderId?: string) => {
  // contex
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('orders');
  // state
  const [orderNotes, setOrderNotes] = React.useState<WithId<ProfileNote>[]>([]);
  // mutations
  const { mutate: updateOrderNote, mutationResult: updateResult } =
    useCustomMutation(
      (data: { changes: Partial<ProfileNote>; id?: string }) => {
        if (!data.id)
          return api.order().createOrderNote(orderId!, data.changes);
        else
          return api.order().updateOrderNote(orderId!, data.id, data.changes);
      },
      'updateOrderNote'
    );
  const { mutate: deleteOrderNote, mutationResult: deleteResult } =
    useCustomMutation(
      (orderNoteId: string) =>
        api.order().deleteOrderNote(orderId!, orderNoteId),
      'deleteOrderNote',
      false
    );
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!orderId) return;
    const unsub = api.order().observeOrderNotes(orderId, setOrderNotes);
    return () => unsub();
  }, [api, userCanRead, orderId]);
  // return
  return {
    orderNotes,
    updateOrderNote,
    updateResult,
    deleteOrderNote,
    deleteResult,
  };
};
