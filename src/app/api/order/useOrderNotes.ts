import { ProfileNote, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useOrderNotes = (orderId?: string) => {
  // contex
  const api = useContextApi();
  // state
  const [orderNotes, setOrderNotes] = React.useState<WithId<ProfileNote>[]>([]);
  // mutations
  const { mutateAsync: updateOrderNote, mutationResult: updateResult } = useCustomMutation(
    async (data: { changes: Partial<ProfileNote>; id?: string }) => {
      if (!data.id) return await api.order().createOrderNote(orderId!, data.changes);
      else return await api.order().updateOrderNote(orderId!, data.id, data.changes);
    },
    'updateOrderNote'
  );
  const { mutateAsync: deleteOrderNote, mutationResult: deleteResult } = useCustomMutation(
    async (orderNoteId: string) => await api.order().deleteOrderNote(orderId!, orderNoteId),
    'deleteOrderNote',
    false
  );
  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    const unsub = api.order().observeOrderNotes(orderId, setOrderNotes);
    return () => unsub();
  }, [api, orderId]);
  // return
  return { orderNotes, updateOrderNote, updateResult, deleteOrderNote, deleteResult };
};
